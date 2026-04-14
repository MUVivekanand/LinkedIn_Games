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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('LinkedinToppers')

    if (req.method === 'GET') {
      const rows = await collection.find({}).sort({ _id: -1 }).toArray()
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const row = req.body
      
      // Remove any duplicate entries for the same date+game combination
      await collection.deleteMany({
        date: row.date,
        game: row.game,
        id: { $ne: row.id }
      })
      
      // Insert or update the row
      await collection.updateOne(
        { id: row.id },
        { $set: row },
        { upsert: true }
      )
      
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ error: 'Database error' })
  }
}
