import type { Message, STORY_ID } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export const messages = model({
  qid: (ids: STORY_ID[]) => ids.toString(),
  format: () => ({
    list: [] as Message[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {
    sort(data.list).asc((o) => o.date)
  }
})
