import type { MoodType, EventType, RoleType } from '../type/enum'
import type { AccountID } from '../type/id'
import type { presentation } from '../type/string'
import type { FOLDER_IDX, SAYCNT, VOTETYPE, GAME } from '.'

export type Story = {
  _id: STORY_ID
  folder: Uppercase<FOLDER_IDX>
  vid: STORY_IDX
  sow_auth_id: AccountID

  password?: presentation
  comment?: presentation

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
    event: EventType[]
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
}

export type StoryBy = { progress?: Story[]; prologue?: Story[] }

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
