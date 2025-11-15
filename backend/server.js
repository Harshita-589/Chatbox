import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenv.config() // ✅ Loads .env (useful in Render/Railway)

const app = express()
const server = http.createServer(app)

// ✅ Allow frontend connection (local or hosted)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*', // use frontend URL in prod
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

// 🧠 API to create a new chat room
app.get('/create-room', (req, res) => {
  const roomId = uuidv4()
  res.json({ roomId })
})

// ⚡ Socket.io setup
io.on('connection', (socket) => {
  console.log('🟢 New user connected:', socket.id)

  socket.on('join-room', (roomId, userName) => {
    socket.join(roomId)
    console.log(`${userName} joined room ${roomId}`)
    socket.to(roomId).emit('user-joined', `${userName} joined the chat`)
  })

  socket.on('send-message', (roomId, message, userName) => {
    console.log(`💬 Message from ${userName} in ${roomId}: ${message}`)
    io.to(roomId).emit('receive-message', { userName, message })
  })

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id)
  })
})

// ✅ Default route to verify backend status
app.get('/', (req, res) => {
  res.send('🚀 Chat Backend is Running Successfully!')
})

// ✅ Use dynamic PORT for deployment
const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
