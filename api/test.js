import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  try {
    // Check environment variables
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'MONGODB_URI not set',
        env: Object.keys(process.env).filter(k => k.includes('MONGO'))
      })
    }

    // Try to connect
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db(process.env.MONGODB_DB || 'Linkedin_Leaderboard')
    
    // Try to access collection
    const collection = db.collection('LinkedinToppers')
    const count = await collection.countDocuments()
    
    await client.close()
    
    return res.status(200).json({ 
      success: true,
      message: 'MongoDB connection successful',
      database: process.env.MONGODB_DB || 'Linkedin_Leaderboard',
      collection: 'LinkedinToppers',
      documentCount: count
    })
  } catch (error) {
    return res.status(500).json({ 
      error: 'Connection failed',
      message: error.message,
      stack: error.stack
    })
  }
}
