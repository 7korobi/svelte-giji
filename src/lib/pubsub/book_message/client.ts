import type { DIC } from '$lib/map-reduce'
import type { BookMessage, BOOK_STORY_ID } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'
import { dic } from '$lib/map-reduce'

export const messages = model({
  qid: (ids: BOOK_STORY_ID[]) => ids.toString(),
  format: () => ({
    list: [] as BookMessage[],
    event: {} as DIC<BookMessage[]>
  }),
  initialize(doc) {},
  reduce(data, doc) {
    dic(data.event, doc.event_id, []).push(doc)
  },
  order(data, { sort }) {
    sort(data.list).asc((o) => o.write_at)
    for (const event_id in data.event) {
      sort(data.event[event_id]).asc((o) => o.write_at)
    }
  }
})
