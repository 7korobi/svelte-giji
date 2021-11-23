import type { RANDOM_TYPE, Random } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export const randoms = model({
  qid: (types: RANDOM_TYPE[]) => types.toString(),
  format: () => ({
    list: [] as Random[],
    sum: 0
  }),
  reduce(data, doc) {
    if (doc.number) {
      data.sum += doc.number
    }
  },
  order(data, { sort }) {}
})
