import { dev } from '$app/env'
import client from '$lib/db/socket.io-client'
import * as stores from './model-client'
import site from '$lib/site'

client(dev ? 'http://localhost:3001' : site.live.io, stores)
