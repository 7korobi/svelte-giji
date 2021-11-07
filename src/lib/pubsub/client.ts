import client from '$lib/db/socket.io-client'
import * as stores from './model-client'

const dev = true

client(dev ? 'http://localhost:3001' : 'https://localhost:3001', stores)
