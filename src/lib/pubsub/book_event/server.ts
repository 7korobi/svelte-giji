import type { BookEvent } from '../map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const events = modelAsMongoDB<BookEvent>('events')
