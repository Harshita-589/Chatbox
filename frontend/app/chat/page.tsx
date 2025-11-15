'use client'
import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

// ✅ Use environment variable or fallback URL
const socket = io(
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://connectu-vlzn.onrender.com',
  {
    transports: ['websocket'],
  }
)

const ChatPage = () => {
  const [roomId, setRoomId] = useState('')
  const [userName, setUserName] = useState('')
  const [joined, setJoined] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{ userName: string; message: string }[]>([])
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // 🧭 Auto-scroll when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 🔊 Setup event listeners
  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessages((prev) => [...prev, data])
    })

    socket.on('user-joined', (msg) => {
      setMessages((prev) => [...prev, { userName: 'System', message: msg }])
    })

    return () => {
      socket.off('receive-message')
      socket.off('user-joined')
    }
  }, [])

  // 🚪 Join a room
  const joinRoom = () => {
    if (!roomId || !userName) return alert('Enter both Room ID and Username!')
    socket.emit('join-room', roomId, userName)
    setJoined(true)
  }

  // 💬 Send message
  const sendMessage = () => {
    if (!message.trim()) return
    socket.emit('send-message', roomId, message, userName)
    setMessage('')
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-white'>
      {!joined ? (
        <div className='bg-[#161b22] p-6 rounded-2xl shadow-lg w-[90%] max-w-sm text-center border border-gray-700'>
          <h2 className='text-2xl font-bold mb-4 text-blue-400'>Join a Chat Room</h2>
          <input
            type='text'
            placeholder='Enter Username'
            className='bg-[#0d1117] border border-gray-600 text-white p-2 rounded w-full mb-3 focus:outline-none focus:border-blue-500'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type='text'
            placeholder='Enter Room ID'
            className='bg-[#0d1117] border border-gray-600 text-white p-2 rounded w-full mb-4 focus:outline-none focus:border-blue-500'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            onClick={joinRoom}
            className='bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded w-full font-semibold'
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className='flex flex-col w-full h-screen bg-[#0d1117]'>
          {/* Header */}
          <div className='bg-[#161b22] px-6 py-4 border-b border-gray-700 flex justify-between items-center'>
            <h2 className='text-lg font-semibold text-blue-400'>Room: {roomId}</h2>
            <span className='text-gray-400 text-sm'>{userName}</span>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3'>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.userName === userName ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    msg.userName === 'System'
                      ? 'bg-gray-700 text-gray-300 text-center mx-auto'
                      : msg.userName === userName
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-800 text-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.userName !== userName && msg.userName !== 'System' && (
                    <p className='text-xs text-gray-400 mb-1'>{msg.userName}</p>
                  )}
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div className='flex items-center gap-2 border-t border-gray-700 bg-[#161b22] p-4'>
            <input
              type='text'
              placeholder='Type your message...'
              className='flex-1 bg-[#0d1117] border border-gray-600 text-white p-2 rounded-lg focus:outline-none focus:border-blue-500'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className='bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg font-medium'
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPage
