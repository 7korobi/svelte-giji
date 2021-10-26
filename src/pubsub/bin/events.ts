import type { Event } from '../store/events'

import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const events = modelAsMongoDB<Event>('events')
