import type { BookCard, BOOK_CARD_ID } from '../map-reduce'
import { Ables, Roles } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'
import { dic } from '$lib/map-reduce'

export const cards = model({
  qid: (ids: BOOK_CARD_ID[]) => ids.toString(),
  format: () => ({
    list: [] as BookCard[]
  }),
  initialize(doc) {
    doc.role = Roles.find(doc.role_id)
    doc.ables = doc.role.able_ids.map(Ables.find)
    for (const able of doc.ables) {
      const act = dic(doc.act, able._id, {})
      if (able.target) act.target = null
      if (able.btn) act.done = false
      if (able.sw && able.pass) act.done = false
      if (able.text) {
        if (doc.story.say_limit?.count) act.unit = 'count'
        if (doc.story.say_limit?.all) act.unit = 'all'
      }
    }
  },
  reduce(data, doc) {},
  order(data, { sort }) {
    sort(data.list).asc((o) => o._id)
  }
})
