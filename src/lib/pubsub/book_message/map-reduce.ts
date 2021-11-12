import type { AccountID, FaceID } from '../_type/id'
import type { presentation } from '../_type/string'
import type { STORY_IDX, STORY_ID, EVENT_IDX, EVENT_ID, FOLDER_IDX } from '../map-reduce'

export type Message = {
  _id: MESSAGE_ID
  story_id: STORY_ID
  event_id: EVENT_ID
  mestype: MesType
  subid: SubType
  logid: MESSAGE_IDX
  csid?: string
  sow_auth_id: AccountID
  date: Date
  size: number
  face_id: FaceID
  style?: StyleType
  name: presentation
  to?: presentation
  log: presentation
}

export type MESSAGE_TYPE_IDX = `${LogType}${SubType}`
export type MESSAGE_IDX = `${LogType}${SubType}${number}`
export type MESSAGE_ID = `${FOLDER_IDX}-${STORY_IDX}-${EVENT_IDX}-${MESSAGE_IDX}`

export type HANDLE = typeof HANDLES[number]
export type StyleType = typeof StyleTypes[number]
export type MesType = typeof MesTypes[number]
export type LogType = typeof LogTypes[number]
export type SubType = typeof SubTypes[number]

export const HANDLES = [
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

export const StyleTypes = ['text', 'head', 'mono'] as const
export const MesTypes = [
  'CAST',
  'ADMIN',
  'MAKER',
  'INFOSP',
  'INFONOM',
  'AIM',
  'TSAY',
  'WSAY',
  'GSAY',
  'SAY',
  'DELETED'
] as const

export const LogTypes = ['c', 'a', 'm', 'i', 'I', 'T', 'W', 'S', 'D'] as const
export const SubTypes = ['A', 'I', 'M', 'S'] as const
