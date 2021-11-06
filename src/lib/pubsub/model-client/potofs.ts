import type { ObjectId } from 'mongodb'
import type { Potof } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export const potofs = model({
  qid: (ids: ObjectId[]) => ids.toString(),
  format: () => ({
    list: [] as Potof[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }, is_asc: boolean, order: (o: Potof) => any) => {
    if (is_asc) {
      sort(data.list).asc(order)
    } else {
      sort(data.list).desc(order)
    }
    /*
		sort(data.list).asc((o) => o.live)
		sort(data.list).asc((o) => o.deathday)

		sort(data.list).asc((o) => o.clearance)
		sort(data.list).asc((o) => o.zapcount)

		sort(data.list).asc((o) => o.point.actaddpt)

		sort(data.list).asc((o) => o.role[0])
		*/
  }
})
