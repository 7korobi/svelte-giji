import { db } from '$lib/db'
import type { Document } from '$lib/db'

const range = 1000 * 3600 * 24 * 50 // 50 days

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
  const limit = new Date(new Date().getTime() - range)
  const plans = await db()
    .collection('sow_village_plans')
    .find({ write_at: { $gte: limit }, state: { $in: [null, /議事/] } })
    .toArray<Document.Plan>()
  return {
    body: {
      plans
    }
  }
}
