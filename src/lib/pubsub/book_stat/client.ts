import type { BookStat, BOOK_STAT_ID } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export const stats = model({
  qid: (ids: BOOK_STAT_ID[]) => ids.toString(),
  format: () => ({
    list: [] as BookStat[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {
    sort(data.list).asc((o) => o._id)
  }
})
