import type { AccountID } from '../_type/id'
import type { presentation } from '../_type/string'
import type {
  BOOK_FOLDER_IDX,
  SAYCNT,
  VOTETYPE,
  GAME,
  BookFolder,
  BookEvent,
  SayLimit,
  ROLE_ID,
  MobRole,
  MOB_ID,
  Mark,
  Game,
  RoleTable,
  OPTION_ID,
  Option,
  MARK_ID,
  Role,
  TRAP_ID,
  SAY_LIMIT_ID,
  GAME_ID
} from '../map-reduce'

export type BookStory = {
  _id: BOOK_STORY_ID
  vid: BOOK_STORY_IDX

  folder_id: Lowercase<BOOK_FOLDER_IDX>
  sow_auth_id: AccountID
  say_limit_id: SAY_LIMIT_ID
  game_id: GAME_ID
  trap_ids: TRAP_ID[]
  config_ids: ROLE_ID[]
  discard_ids: ROLE_ID[]

  in_month: presentation
  yeary: presentation
  monthry: presentation

  folder?: BookFolder
  prologue?: BookEvent
  say_limit: SayLimit
  mob_role: MobRole
  game: Game
  role_table: RoleTable
  marks: Mark[]
  options: Option[]
  traps: (Role & { count: number })[]
  configs: (Role & { count: number })[]
  discards: (Role & { count: number })[]

  type: {
    say: SAYCNT
    mob: MOB_ID
    game: GAME
    vote: VOTETYPE
    roletable: ROLETABLE
  }

  is_epilogue: boolean
  is_finish: boolean
  is_full_commit: boolean

  write_at: Date

  vpl: [number, number]
  rating: MARK_ID
  option_ids: OPTION_ID[]
  mark_ids: MARK_ID[]
  upd: {
    interval: number
    hour: number
    minute: number
  }
  card: {
    event: TRAP_ID[]
    discard: ROLE_ID[]
    config: ROLE_ID[]
  }
  timer: {
    updateddt: Date
    nextupdatedt: Date
    nextchargedt: Date
    nextcommitdt: Date
    scraplimitdt: Date
  }
  name: presentation
  upd_range: presentation
  upd_at: presentation
  size: presentation

  password?: presentation
  comment?: presentation
}

export type BOOK_STORY_IDX = `${number}`
export type BOOK_STORY_ID = `${string}-${BOOK_STORY_IDX}`

export type ROLETABLE = typeof ROLETABLES[number]

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
