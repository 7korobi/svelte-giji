import type { presentation } from '../_type/string'
import type { BOOK_POTOF_ID, BOOK_EVENT_ID, BookStory, BOOK_STORY_ID } from '../map-reduce'

export type BookStat = {
  story_id: BOOK_STORY_ID
  story: BookStory
} & (
  | {
      _id: BOOK_EVENT_ID
    }
  | {
      _id: `${BOOK_POTOF_ID}-give`
      give: number
    }
  | {
      _id: `${BOOK_POTOF_ID}-commit`
      sw: boolean
    }
)

export type BOOK_STAT_IDX = 'give'
export type BOOK_STAT_ID = `${BOOK_POTOF_ID}-${BOOK_STAT_IDX}`
