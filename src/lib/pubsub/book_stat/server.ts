import type { BOOK_STORY_ID, BookStat } from '../map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const stats = modelAsMongoDB<BookStat>('stats')

export const stat_oldlog = {
  ...stats,
  $match: (story_id: BOOK_STORY_ID) => ({
    story_id
  })
}
