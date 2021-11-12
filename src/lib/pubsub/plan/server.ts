import type { Plan } from '../map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

const range = 1000 * 3600 * 24 * 50 // 50 days

export const sow_village_plans = modelAsMongoDB<Plan>('sow_village_plans')

export const new_plans = {
  ...sow_village_plans,
  $match: () => ({
    state: { $in: [null, /議事/] },
    write_at: { $gte: new Date(Date.now() - range) }
  })
}
