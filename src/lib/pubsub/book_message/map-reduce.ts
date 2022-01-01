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
import { MapReduce } from '$lib/map-reduce'

export type BookMessage = {
  _id: BOOK_MESSAGE_ID
  story_id: BOOK_STORY_ID
  event_id: BOOK_EVENT_ID
  sow_auth_id: AccountID
  potof_id?: BOOK_POTOF_ID
  face_id?: FaceID
  mention_ids: BOOK_MESSAGE_ID[]

  phase: BookPhase
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
  logid?: `${BOOK_PHASE_IDX_BARE}-${BOOK_MESSAGE_IDX}`
  csid?: CHR_SET_IDX
  size?: number

  deco: '' | 'head' | 'mono' | 'logo'
  style?: StyleType
  name?: presentation
  to?: presentation
  log: presentation
}

export type BookPhase = {
  _id: BOOK_PHASE_IDX
  is_show: boolean
  mark?: BOOK_PHASE_MARK
  handle: HANDLE
  label: presentation
  text: presentation
}

export type BOOK_PHASE_MARK = ' ' | '' | '#' | '%' | '@' | '-' | '+' | '=' | '*' | '!'
export type BOOK_PHASE_IDX_BARE = `${LogType}${SubType}` | 'MM' | 'AIM' | 'DEL'
export type BOOK_PHASE_IDX = keyof typeof phase_data
export type BOOK_PHASE_ID = `${string}-${BOOK_STORY_IDX}-${BOOK_EVENT_IDX}-${LogType}${SubType}`
export type BOOK_MESSAGE_IDX = `${number | 'cast' | 'vrule' | 'welcome' | 'title'}`
export type BOOK_MESSAGE_ID =
  | `${string}-${BOOK_STORY_IDX}-${BOOK_EVENT_IDX}-${BOOK_PHASE_IDX}-${number}`
  | `${string}-${BOOK_STORY_IDX}-${BOOK_EVENT_IDX}-mS-cast`
  | `${string}-${BOOK_STORY_IDX}-top-mS-title`
  | `${string}-${BOOK_STORY_IDX}-top-mS-welcome`
  | `${string}-${BOOK_STORY_IDX}-top-mS-vrule`

export type CHAT = typeof CHAT[number]
export type HANDLE = typeof HANDLE[number]
export type StyleType = typeof StyleType[number]
export type MesType = typeof MesType[number]
export type LogType = typeof LogType[number]
export type SubType = typeof SubType[number]
export type GroupType = typeof GroupType[number]

const phase_data = {
  DEL: [true, ' ', 'private', '-', '-'],
  AIM: [true, '-', 'AIM', '内緒', '内緒話'],
  mS: [true, '#', 'MAKER', '村建', '村建て発言'],
  mA: [true, ' ', 'MAKER', '村建', '村建てACT'],
  aS: [true, '%', 'ADMIN', '管理', '管理発言'],
  aA: [true, ' ', 'ADMIN', '管理', '管理ACT'],
  cI: [true, ' ', 'TITLE', '出演', '出演一覧'],
  iI: [true, ' ', 'private', '活動', '秘匿活動'],
  II: [true, ' ', 'public', '活動', '公開活動'],
  SS: [true, '', 'SSAY', '会話', '通常の発言'],
  SA: [true, ' ', 'SSAY', '会話', '通常ACT'],
  VS: [true, '@', 'VSSAY', '見物', '見物人発言'],
  VA: [true, ' ', 'VSSAY', '見物', '見物人のACT'],
  TS: [true, '-', 'TSAY', '独言', '独り言'],
  TA: [true, ' ', 'TSAY', '栞', '栞'],
  GS: [true, '+', 'GSAY', '墓下', '墓下の発言'],
  GA: [true, ' ', 'GSAY', '墓下', '墓下のACT'],
  PS: [true, '=', 'PSAY', '共鳴', '共鳴の会話'],
  PA: [true, ' ', 'PSAY', '共鳴', '共鳴のACT'],
  WS: [true, '*', 'WSAY', '人狼', '人狼のささやき'],
  WA: [true, ' ', 'WSAY', '人狼', '人狼のACT'],
  XS: [true, '!', 'XSAY', '念波', '念話（念波の民）'],
  XA: [true, ' ', 'XSAY', '念波', '念act（念波の民）'],
  BS: [true, '!', 'XSAY', '念波', '念話（蝙蝠人間）'],
  BA: [true, ' ', 'XSAY', '念波', '念act（蝙蝠人間）']
} as const

export const CHAT = ['report', 'talk', 'post', 'logo', 'cast'] as const

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

export const LogType = [
  'c',
  'a',
  'm',
  'i',
  'I',
  'D',
  'S',
  'V',
  'G',
  'T',
  'W',
  'P',
  'X',
  'B'
] as const
export const SubType = ['A', 'I', 'M', 'S', 'B'] as const
export const GroupType = ['A', 'I', 'M', 'S'] as const

export const Phases = MapReduce({
  format: () => ({
    list: [] as BookPhase[]
  }),
  reduce: (data, doc) => {},
  order: (doc, { sort }) => {}
})

type MARK = typeof phase_data[keyof typeof phase_data][1]
for (const key in phase_data) {
  const [is_show, mark, handle, label, text] = phase_data[key as keyof typeof phase_data]
  Phases.add([{ _id: key as BOOK_PHASE_IDX, is_show, mark, handle, label, text }])
}
