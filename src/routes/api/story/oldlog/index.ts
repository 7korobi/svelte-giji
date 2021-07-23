import { db } from '$lib/db'
import type { Document } from '$lib/db'

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
  const [stories, faces] = await Promise.all([
    db()
      .collection('stories')
      .find({ is_epilogue: true, is_finish: true })
      .project({ comment: 0, password: 0 })
      .toArray<Document.Story>(),
    db().collection('potof_for_face').find().toArray<Document.PotofForFace>()
  ])
  return {
    body: {
      stories,
      faces
    }
  }
}
