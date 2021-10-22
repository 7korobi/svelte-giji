import type { WinType } from '../type/enum'
import type { EventID, StoryID, EventIDX } from '../type/id'
import type { ISO8601, presentation } from '../type/string'

export type Event = {
  _id: EventID
  story_id: StoryID
  turn: EventIDX
  winner: WinType
  created_at: ISO8601
  updated_at: ISO8601
  event?: null
  epilogue?: 0 | -1
  grudge?: 0 | -1
  riot?: 0 | -1
  scapegoat?: 0 | -1
  eclipse?: EventIDX[]
  seance?: EventIDX[]
  say?: {
    modifiedsay: ISO8601
    modifiedwsay?: ISO8601
    modifiedgsay?: ISO8601
    modifiedspsay?: ISO8601
    modifiedxsay?: ISO8601
    modifiedvsay?: ISO8601
  }
  name?: presentation
}
