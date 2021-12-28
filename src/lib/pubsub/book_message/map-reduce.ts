import type { AccountID, FaceID } from '../_type/id'
import type { presentation } from '../_type/string'
import type {
  BOOK_STORY_IDX,
  BOOK_STORY_ID,
  BOOK_EVENT_IDX,
  BOOK_EVENT_ID,
  BOOK_FOLDER_IDX,
  BookEvent,
  BookStory,
  BookPotof,
  BOOK_POTOF_ID,
  CHR_SET_IDX,
  Face
} from '../map-reduce'

export type BookMessage = {
  _id: BOOK_MESSAGE_ID
  story_id: BOOK_STORY_ID
  event_id: BOOK_EVENT_ID
  sow_auth_id: AccountID
  potof_id?: BOOK_POTOF_ID
  face_id?: FaceID
  mention_ids: BOOK_MESSAGE_ID[]

  story: BookStory
  event: BookEvent
  potof?: BookPotof
  face?: Face

  write_at: Date
  date?: string

  show: CHAT

  handle: HANDLE
  mestype?: MesType

  group: GroupType
  subid?: SubType
  logid?: `${BOOK_PHASE_IDX}-${BOOK_MESSAGE_IDX}`
  csid?: CHR_SET_IDX
  size?: number

  deco: '' | 'head' | 'mono' | 'logo'
  style?: StyleType
  name?: presentation
  to?: presentation
  log: presentation
}

export type BOOK_PHASE_IDX = `${LogType}${SubType}` | 'MM' | 'AIM'
export type BOOK_PHASE_ID = `${BOOK_FOLDER_IDX}-${BOOK_STORY_IDX}-${BOOK_EVENT_IDX}-${LogType}${SubType}`
export type BOOK_MESSAGE_IDX = `${number | 'CAST' | 'vrule' | 'welcome' | 'title'}`
export type BOOK_MESSAGE_ID = `${BOOK_FOLDER_IDX}-${BOOK_STORY_IDX}-${BOOK_EVENT_IDX}-${BOOK_PHASE_IDX}-${BOOK_MESSAGE_IDX}`

export type CHAT = typeof CHAT[number]
export type HANDLE = typeof HANDLE[number]
export type StyleType = typeof StyleType[number]
export type MesType = typeof MesType[number]
export type LogType = typeof LogType[number]
export type SubType = typeof SubType[number]
export type GroupType = typeof GroupType[number]

export const CHAT = ['report', 'talk', 'post']

export const HANDLE = [
  'TITLE',
  'MAKER',
  'ADMIN',
  'AIM',
  'GAIM',
  'TSAY',
  'SSAY',
  'VSSAY',
  'MSAY',
  'GSAY',
  'VGSAY',
  'WSAY',
  'PSAY',
  'HSAY',
  'LSAY',
  'XSAY',
  'FSAY',
  'ELSE',
  'hide',
  'private',
  'public'
] as const

export const StyleType = ['text', 'head', 'mono'] as const
export const MesType = [
  'CAST',
  'ADMIN',
  'MAKER',
  'INFOSP',
  'INFONOM',
  'INFOWOLF',
  'AIM',
  'TSAY',
  'WSAY',
  'GSAY',
  'VSAY',
  'BSAY',
  'SPSAY',
  'SAY',
  'DELETED'
] as const

export const LogType = ['c', 'a', 'm', 'i', 'I', 'T', 'W', 'S', 'D'] as const
export const SubType = ['A', 'I', 'M', 'S', 'B'] as const
export const GroupType = ['A', 'I', 'M', 'S'] as const
