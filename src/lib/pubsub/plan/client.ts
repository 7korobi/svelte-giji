import type { Plan } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export const new_plans = model({
  qid: () => '',
  format: () => ({
    list: [] as Plan[],
    count: 0
  }),
  reduce(data, doc) {
    data.count++
  },
  order(data, { sort }) {
    sort(data.list).desc((o) => o.write_at)
  }
})
