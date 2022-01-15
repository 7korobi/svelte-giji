import { dev } from '$app/env'
import client from '$lib/db/socket.io-client'
import * as stores from './model-client'
import { live } from '$lib/site'

client(dev ? 'http://:4002' : live.io, stores)
