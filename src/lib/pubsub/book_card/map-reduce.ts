import type { DIC } from 'svelte-map-reduce-store'
import type {
  BOOK_POTOF_ID,
  ROLE_ID,
  Role,
  BookStory,
  BOOK_STORY_ID,
  BookPotof,
  Able
} from '../map-reduce'

type BookCardBase = {
  role_id: ROLE_ID
  story_id: BOOK_STORY_ID
  story: BookStory
  potof: BookPotof
  role?: Role
  ables?: Able[]
  act: DIC<{
    target?: BOOK_POTOF_ID
    done?: boolean
    unit?: 'count' | 'all'
    remain?: number
  }>
}

export type BookCardRole = {
  _id: `${BOOK_POTOF_ID}-${'role' | 'gift'}`
} & BookCardBase

export type BookCardSelect = {
  _id: `${BOOK_POTOF_ID}-select`
} & BookCardBase

export type BookCardLive = {
  _id: `${BOOK_POTOF_ID}-live`
  date: number
} & BookCardBase

export type BookCard = BookCardRole | BookCardSelect | BookCardLive

export type BOOK_CARD_IDX = 'live' | 'role' | 'gift' | 'request'
export type BOOK_CARD_ID = `${BOOK_POTOF_ID}-${BOOK_CARD_IDX}`
