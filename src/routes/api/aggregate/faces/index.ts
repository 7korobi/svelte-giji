import { db } from '$lib/db'
import type { Document } from '$lib/db'

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params: { face_id } }: { params: { face_id: string } }) {
  const [m_faces, faces, sow_auths] = await Promise.all([
    db().collection('message_for_face').find().toArray<Document.MessageForFace>(),
    db().collection('potof_for_face').find().toArray<Document.PotofForFace>(),
    db().collection('potof_for_face_sow_auth_max').find().toArray<Document.PotofForFaceSowAuthMax>()
  ])
  return {
    body: { m_faces, faces, sow_auths }
  }
}
