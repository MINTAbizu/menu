import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { connectDatabase, disconnectDatabase } from './lib/database.js'
import { registerSocketHandlers } from './sockets/index.js'

await connectDatabase()

const app = createApp()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  },
})

app.set('io', io)
registerSocketHandlers(io)

httpServer.listen(env.PORT, () => {
  console.log(`Hospitality OS API listening on http://localhost:${env.PORT}`)
})

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down API.`)
  io.close()
  httpServer.close(async () => {
    await disconnectDatabase()
    process.exit(0)
  })
}

process.on('SIGTERM', () => void shutdown('SIGTERM'))
process.on('SIGINT', () => void shutdown('SIGINT'))
