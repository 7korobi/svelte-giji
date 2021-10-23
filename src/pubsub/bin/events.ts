import type { EventID, StoryID } from '../type/id'
import type { Event } from '../store/events'

import { model } from '$lib/db/socket.io-server'
import { db, watch } from '$lib/db'

const $project = { comment: 0, password: 0 }
const set = ($set: Event) => table().findOneAndUpdate({ _id: $set._id }, { $set }, { upsert: true })
const del = (ids: EventID[]) => table().deleteMany({ _id: ids })
const table = () => db().collection<Event>('events')

export const event_progress = model({
  $match: () => ({
    is_epilogue: false,
    is_finish: false
  }),

  set,
  del,
  isLive: async () => true,
  live: ($match, set, del) => watch(set, del, table, [{ $match }, { $project }]),
  query: async ($match) => table().find($match).toArray()
})

export const event_oldlog = model({
  $match: (story_id: StoryID) => ({
    story_id
  }),
  query: async ($match) => table().find($match).toArray()
})
