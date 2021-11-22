import type { MoodType, RoleType } from '../_type/enum'
import type { AccountID } from '../_type/id'
import type { presentation } from '../_type/string'
import type { FOLDER_IDX, SAYCNT, VOTETYPE, GAME, Folder, Event } from '../map-reduce'

export type Story = {
  _id: STORY_ID
  vid: STORY_IDX

  folder_id: Lowercase<FOLDER_IDX>
  sow_auth_id: AccountID

  folder?: Folder
  prologue?: Event

  is_epilogue: boolean
  is_finish: boolean
  is_full_commit: boolean
  vpl: [number, number]
  rating: MoodType
  options: BOOK_OPTION[]
  type: {
    say: SAYCNT
    vote: VOTETYPE
    roletable: ROLETABLE
    mob: MOB
    game: GAME
  }
  upd: {
    interval: number
    hour: number
    minute: number
  }
  card: {
    event: string[]
    discard: RoleType[]
    config: RoleType[]
  }
  timer: {
    updateddt: Date
    nextupdatedt: Date
    nextchargedt: Date
    nextcommitdt: Date
    scraplimitdt: Date
  }
  name: presentation

  password?: presentation
  comment?: presentation
  write_at?: number
}

export type STORY_IDX = number
export type STORY_ID = `${FOLDER_IDX}-${STORY_IDX}`

export type BOOK_OPTION = typeof BOOK_OPTIONS[number]
export type ROLETABLE = typeof ROLETABLES[number]
export type MOB = typeof MOBS[number]

export const BOOK_OPTIONS = [
  'aiming-talk',
  'entrust',
  'random-target',
  'select-role',
  'seq-event',
  'undead-talk'
] as const

export const ROLETABLES = [
  'custom',
  'default',
  'hamster',
  'lover',
  'mistery',
  'random',
  'test1st',
  'test2nd',
  'ultimate',
  'wbbs_c',
  'wbbs_f',
  'wbbs_g'
] as const

export const MOBS = ['alive', 'gamemaster', 'grave', 'juror', 'visiter']
