import { db } from '$lib/db'
import type { Document } from '$lib/db'

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params: { story_id } }: { params: { story_id: string } }) {
  const [stories, messages, events, potofs] = await Promise.all([
    db()
      .collection('stories')
      .find({ _id: story_id, is_epilogue: true, is_finish: true })
      .project({ password: false })
      .toArray<Document.Story>(),
    db().collection('messages').find({ story_id }).toArray<Document.Message>(),
    db().collection('events').find({ story_id }).toArray<Document.Event>(),
    db().collection('potofs').find({ story_id }).toArray<Document.Potof>()
  ])
  return {
    body: {
      stories,
      messages,
      events,
      potofs
    }
  }
}
