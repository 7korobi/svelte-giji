import type { LogType, SubType } from './type'

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

export type PotofIDX = number
export type StoryIDX = number
export type EventIDX = number
export type MessageTypeIDX = `${LogType}${SubType}`
export type MessageIDX = `${LogType}${SubType}${number}`

export type StoryID = `${Lowercase<FolderIDX>}-${StoryIDX}`
export type EventID = `${Lowercase<FolderIDX>}-${StoryIDX}-${EventIDX}`
export type MessageID = `${Lowercase<FolderIDX>}-${StoryIDX}-${EventIDX}-${MessageIDX}`

export type FaceID = string
export type AccountID = string
