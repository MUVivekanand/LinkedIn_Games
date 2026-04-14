import { MongoClient } from 'mongodb'

let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = client.db(process.env.MONGODB_DB || 'Linkedin_Leaderboard')

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('LinkedinToppers')

    // Get all rows
    const allRows = await collection.find({}).toArray()

    // Find duplicates (same date + game)
    const seen = new Map()
    const toDelete = []

    for (const row of allRows) {
      const key = `${row.date}-${row.game}`
      if (seen.has(key)) {
        // This is a duplicate, mark for deletion
        toDelete.push(row._id)
      } else {
        seen.set(key, row._id)
      }
    }

    // Delete duplicates
    if (toDelete.length > 0) {
      await collection.deleteMany({ _id: { $in: toDelete } })
    }

    return res.status(200).json({ 
      success: true, 
      deletedCount: toDelete.length,
      message: `Removed ${toDelete.length} duplicate entries`
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return res.status(500).json({ error: 'Cleanup failed' })
  }
}
