import type { ObjectId } from 'mongodb'
import type { AccountID, FaceID } from '../_type/id'
import type { presentation } from '../_type/string'
import type {
  BOOK_STORY_ID,
  BOOK_EVENT_ID,
  BOOK_EVENT_IDX,
  BookCard,
  BookStat,
  ROLE_ID,
  CHR_SET_IDX
} from '../map-reduce'
import type { SayLimit } from '../set_say/map-reduce'

export type BookPotof = {
  _id: ObjectId | BOOK_POTOF_ID
  story_id: BOOK_STORY_ID
  event_id: BOOK_EVENT_ID
  face_id: FaceID

  sow_auth_id: AccountID

  job: string
  csid: CHR_SET_IDX
  clearance: number
  zapcount: number

  cards: BookCard[]
  select?: ROLE_ID
  role?: ROLE_ID[]
  rolestate?: number

  stats: BookStat[]
  commit?: boolean
  live?: LiveType
  deathday?: number

  overhear: BOOK_EVENT_IDX[]
  point: {
    actaddpt: number
    saidcount: number
    saidpoint: number
  }
  timer: {
    entrieddt: Date
    limitentrydt: Date
  }
  say: SayLimit
  jobname?: presentation
  history?: presentation
}

export type BOOK_POTOF_ID = `${BOOK_STORY_ID}-${BOOK_POTOF_IDX}`
export type BOOK_POTOF_IDX = `${number}`

export type LiveType = 'mob' | 'live' | 'victim' | 'executed' | 'suddendead'
