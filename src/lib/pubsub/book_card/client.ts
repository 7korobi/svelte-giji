import type { BookCard, BOOK_CARD_ID } from '../map-reduce'
import { Roles } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export const cards = model({
  qid: (ids: BOOK_CARD_ID[]) => ids.toString(),
  format: () => ({
    list: [] as BookCard[]
  }),
  reduce(data, doc) {
    doc.role = Roles.find(doc.role_id)
  },
  order(data, { sort }) {
    sort(data.list).asc((o) => o._id)
  }
})
