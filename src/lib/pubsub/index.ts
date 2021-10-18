import { io } from 'socket.io-client'
import parser from 'socket.io-msgpack-parser'

export const PubSub = io('http://localhost:3001', {
  parser,
  port: '3001',
  auth: {
    token: '123'
  },
  query: {
    'my-key': 'my-value'
  },
  extraHeaders: {
    'my-custom-header': 'abcd'
  }
})
