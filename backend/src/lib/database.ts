import mongoose from 'mongoose'
import { env } from '../config/env.js'

mongoose.set('strictQuery', true)

export const connectDatabase = async () => {
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== 'production',
  })

  const connection = mongoose.connection
  console.log(`MongoDB connected: ${connection.name}`)
}

export const disconnectDatabase = async () => {
  await mongoose.disconnect()
}
