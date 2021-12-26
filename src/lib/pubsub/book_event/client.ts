import type { BookEvent, BOOK_EVENT_ID } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export const events = model({
  qid: (ids: BOOK_EVENT_ID[]) => ids.toString(),
  format: () => ({
    list: [] as BookEvent[]
  }),
  reduce(data, doc) {
    doc.write_at = new Date(doc.updated_at)
  },
  order(data, { sort }) {
    sort(data.list).asc([(o) => o.story_id, (o) => o.turn])
  }
})
