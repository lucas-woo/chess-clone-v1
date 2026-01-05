import mongoose from "mongoose"  
  
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chess-puzzle"

export const connectMongo = async(): Promise<boolean> => {
  try{
    await mongoose.connect(MONGO_URI)
    console.log("Database connected")
    return true
  } catch (e) {
    console.error("Error connecting to mongodb")
    return false
  }
}