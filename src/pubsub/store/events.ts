import type { WinType } from '../type/enum'
import type { EventID, StoryID, EventIDX } from '../type/id'
import type { presentation } from '../type/string'

import { model } from '$lib/db/socket.io-client'

export type Event = {
  _id: EventID
  story_id: StoryID
  turn: EventIDX
  winner: WinType
  created_at: Date
  updated_at: Date
  event?: null
  epilogue?: 0 | -1
  grudge?: 0 | -1
  riot?: 0 | -1
  scapegoat?: 0 | -1
  eclipse?: EventIDX[]
  seance?: EventIDX[]
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

export const events = model({
  qid: (ids: EventID[]) => ids.toString(),
  format: () => ({
    list: [] as Event[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {
    sort(data.list).asc([(o) => o.story_id, (o) => o.turn])
  }
})
