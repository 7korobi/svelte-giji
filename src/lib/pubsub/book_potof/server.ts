import type { BOOK_STORY_ID, BookPotof } from '../map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const potofs = modelAsMongoDB<BookPotof>('potofs')

export const potof_oldlog = {
  ...potofs,
  $match: (story_id: BOOK_STORY_ID) => ({
    story_id
  })
}
