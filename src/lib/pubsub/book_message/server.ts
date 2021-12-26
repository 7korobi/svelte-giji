import type { BOOK_STORY_ID, BookMessage } from '../map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const messages = modelAsMongoDB<BookMessage>('messages')

export const message_oldlog = {
  ...messages,
  $match: (story_id: BOOK_STORY_ID) => ({
    story_id
  })
}
