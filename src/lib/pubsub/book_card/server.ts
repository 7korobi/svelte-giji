import type { BOOK_STORY_ID, BookCard } from '../map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const cards = modelAsMongoDB<BookCard>('cards')

export const card_oldlog = {
  ...cards,
  $match: (story_id: BOOK_STORY_ID) => ({
    story_id
  })
}
