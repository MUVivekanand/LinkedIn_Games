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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('LinkedinToppers')

    const rows = await collection.find({}).toArray()

    const totals = {
      kirukku: 0,
      srinathi: 0,
      vivaaek: 0
    }

    rows.forEach(row => {
      totals.kirukku += row.kirukku || 0
      totals.srinathi += row.srinathi || 0
      totals.vivaaek += row.vivaaek || 0
    })

    const leaderboard = [
      { name: 'kirukku', totalPoints: totals.kirukku },
      { name: 'srinathi', totalPoints: totals.srinathi },
      { name: 'vivaaek', totalPoints: totals.vivaaek }
    ].sort((a, b) => b.totalPoints - a.totalPoints)

    return res.status(200).json(leaderboard)
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ 
      error: 'Database error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
