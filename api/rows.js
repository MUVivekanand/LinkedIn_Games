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
      
      // Remove isEditing field before saving to database
      const { isEditing, ...cleanRow } = row
      
      // Ensure all required fields exist
      if (!cleanRow.id || !cleanRow.date || !cleanRow.game) {
        return res.status(400).json({ error: 'Missing required fields: id, date, or game' })
      }
      
      // Ensure numeric fields are numbers
      cleanRow.kirukku = parseInt(cleanRow.kirukku) || 0
      cleanRow.srinathi = parseInt(cleanRow.srinathi) || 0
      cleanRow.vivaaek = parseInt(cleanRow.vivaaek) || 0
      
      try {
        // Remove any duplicate entries for the same date+game combination
        await collection.deleteMany({
          date: cleanRow.date,
          game: cleanRow.game,
          id: { $ne: cleanRow.id }
        })
        
        // Insert or update the row
        const result = await collection.updateOne(
          { id: cleanRow.id },
          { $set: cleanRow },
          { upsert: true }
        )
        
        return res.status(200).json({ 
          success: true, 
          modified: result.modifiedCount,
          upserted: result.upsertedCount 
        })
      } catch (dbError) {
        console.error('MongoDB operation error:', dbError)
        return res.status(500).json({ 
          error: 'Database operation failed', 
          details: dbError.message 
        })
      }
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ 
      error: 'Database error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
