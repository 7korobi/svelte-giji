import { db } from '$lib/db'
import type { Document } from '$lib/db'
import type { EventID } from '$lib/db/giji/id'

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
  const stories = await db()
    .collection('stories')
    .find({ is_epilogue: false, is_finish: false })
    .project({ comment: 0, password: 0 })
    .toArray<Document.Story>()

  const event_ids = stories.map<EventID>((o) => `${o._id}-0`)
  const events = await db()
    .collection('events')
    .find({ _id: { $in: event_ids } })
    .toArray<Document.Event>()
  return {
    body: {
      stories,
      events
    }
  }
}
