import client from '$lib/db/socket.io-client'
import * as stores from './model-client'
import site from '$lib/site'

const dev = false

client(dev ? 'http://localhost:3001' : site.live.io, stores)
