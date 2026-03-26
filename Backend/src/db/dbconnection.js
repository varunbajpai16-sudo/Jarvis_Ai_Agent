import mongoose from 'mongoose'
import Database from '../constants.js'

async function Dbconnection() {
  try {
    if (!process.env.DB_URI) {
      throw new Error('DB_URI is missing')
    }
    const connected = await mongoose.connect(`${process.env.DB_URI}/${Database}`)
    console.log('✅ MongooDB connected successfully', connected.connection.name)
  } catch (error) {
    console.log('❌ MongooDB is not connected:', error.message)
  }
}
export default Dbconnection;
