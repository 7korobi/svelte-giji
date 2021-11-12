import type { STORY_ID, Message } from '../map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const messages = modelAsMongoDB<Message>('messages')

export const message_oldlog = {
  ...messages,
  $match: (story_id: STORY_ID) => ({
    story_id
  })
}
