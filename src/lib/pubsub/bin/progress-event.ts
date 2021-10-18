import type { ModelEntry } from '$lib/db'
import { db, watch } from '$lib/db'

import type { EventID, EventIDX, StoryID } from '$lib/db/giji/id'
import type { WinType } from '$lib/db/giji/type'
import type { ISO8601, presentation } from '$lib/config'

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

function model() {
  return db().collection<Event>('events')
}

function $match(story_ids: StoryID[]) {
  const event_ids = story_ids.map<EventID>((id) => `${id}-0`)
  return { _id: { $in: event_ids } }
}

export default {
  $match,
  qid: () => '',

  isLive: async () => true,
  live: ($match, set, del) => watch(set, del, model, [{ $match }]),

  async query($match) {
    return await model().find($match).toArray()
  }
} as ModelEntry<[StoryID[]], EventID, Event, ReturnType<typeof $match>>
