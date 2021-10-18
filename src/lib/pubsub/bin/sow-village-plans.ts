import type { ObjectId } from 'mongodb'
import type { ModelEntry } from '$lib/db'
import { db, watch } from '$lib/db'

import type { presentation } from '$lib/config'
import type { AccountID } from '$lib/db/giji/id'

type Plan = {
  _id: ObjectId
  link: URL
  write_at: Date
  title: presentation
  name: presentation
  state?: presentation
  chip?: presentation
  sign: AccountID
  card: presentation[]
  upd: {
    description?: presentation
    time?: presentation
    interval?: presentation
    prologue?: presentation
    start?: presentation
  }
  lock: presentation[]
  flavor: presentation[]
  options: presentation[]
  tags: presentation[][]
}

function model() {
  return db().collection<Plan>('sow_village_plans')
}
async function upsert($set: Plan) {
  const res = await model().findOneAndUpdate({ link: $set.link }, { $set }, { upsert: true })
  return res.ok ? res.value : null
}

function $match() {
  return {
    state: { $in: [null, /議事/] }
  }
}

export default {
  $match,
  qid: () => '',

  isLive: async () => true,
  live: ($match, set, del) => watch(set, del, model, [{ $match }]),

  async query($match) {
    const range = 1000 * 3600 * 24 * 50 // 50 days
    const write_at = {
      $gte: new Date(Date.now() - range)
    }

    return await model()
      .find({ ...$match, write_at })
      .toArray()
  },

  async set(docs) {
    const res = await Promise.all(docs.map(upsert))
    const errors = docs.filter((doc, idx) => !res[idx])
    return { errors }
  },

  async del(ids) {
    const res = await model().deleteMany({ _id: ids })
    const errors = res.deletedCount ? ids : []
    return { errors }
  }
} as ModelEntry<[], ObjectId, Plan, ReturnType<typeof $match>>
