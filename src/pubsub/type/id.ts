import type { LogType, SubType } from './enum'

export enum FolderIDX {
  Allstar = 'ALLSTAR',
  Cabala = 'CABALA',
  Ciel = 'CIEL',
  Crazy = 'CRAZY',
  Dais = 'DAIS',
  Lobby = 'LOBBY',
  Morphe = 'MORPHE',
  Offparty = 'OFFPARTY',
  Pan = 'PAN',
  Perjury = 'PERJURY',
  Pretense = 'PRETENSE',
  Rp = 'RP',
  Soybean = 'SOYBEAN',
  Test = 'TEST',
  Ultimate = 'ULTIMATE',
  Wolf = 'WOLF',
  Xebec = 'XEBEC'
}

export type FolderHead = Lowercase<string>
export type PotofIDX = number
export type StoryIDX = number
export type EventIDX = number
export type MessageTypeIDX = `${LogType}${SubType}`
export type MessageIDX = `${LogType}${SubType}${number}`

export type StoryID = `${FolderHead}-${StoryIDX}`
export type EventID = `${FolderHead}-${StoryIDX}-${EventIDX}`
export type MessageID = `${FolderHead}-${StoryIDX}-${EventIDX}-${MessageIDX}`

export type FaceID = string
export type AccountID = string
