import type { presentation } from '../type/string'
import type { FOLDER_IDX, STORY_IDX, STORY_ID } from '.'

export type Event = {
  _id: EVENT_ID
  story_id: STORY_ID
  turn: EVENT_IDX
  winner: WIN
  created_at: Date
  updated_at: Date
  event?: null
  epilogue?: 0 | -1
  grudge?: 0 | -1
  riot?: 0 | -1
  scapegoat?: 0 | -1
  eclipse?: EVENT_IDX[]
  seance?: EVENT_IDX[]
  say?: {
    modifiedsay: Date
    modifiedwsay?: Date
    modifiedgsay?: Date
    modifiedspsay?: Date
    modifiedxsay?: Date
    modifiedvsay?: Date
  }
  name?: presentation
}

export type EVENT_IDX = number
export type EVENT_ID = `${FOLDER_IDX}-${STORY_IDX}-${EVENT_IDX}`
export type WIN = typeof WINS[number]

export const WINS = [
  'NONE',
  'HUMAN',
  'EVIL',
  'WOLF',
  'PIXI',
  'HATER',
  'LOVER',
  'LONEWOLF',
  'GURU',
  'DISH',
  'MOB'
] as const
