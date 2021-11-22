import type { Event, EVENT_ID } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export const events = model({
  qid: (ids: EVENT_ID[]) => ids.toString(),
  format: () => ({
    list: [] as Event[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {
    sort(data.list).asc([(o) => o.story_id, (o) => o.turn])
  }
})
