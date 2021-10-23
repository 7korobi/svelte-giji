import type { Plan } from '../store/sow-village-plans'

import { model } from '$lib/db/socket.io-server'
import { db, watch, ObjectId } from '$lib/db'

const range = 1000 * 3600 * 24 * 50 // 50 days

const set = ($set: Plan) =>
  table().findOneAndUpdate({ link: $set.link }, { $set }, { upsert: true })
const del = (ids: ObjectId[]) => table().deleteMany({ _id: ids })
const table = () => db().collection<Plan>('sow_village_plans')

export const sow_village_plans = model({
  $match: () => ({
    state: { $in: [null, /議事/] }
  }),

  set,
  del,
  isLive: async () => true,
  live: ($match, set, del) => watch(set, del, table, [{ $match }]),
  query: async ($match) =>
    table()
      .find({ ...$match, write_at: { $gte: new Date(Date.now() - range) } })
      .toArray()
})
