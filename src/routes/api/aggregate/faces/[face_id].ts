import { db } from '$lib/db'
import type { Document } from '$lib/db'

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params: { face_id } }: { params: { face_id: string } }) {
  const q = {
    '_id.face_id': face_id
  }
  const [m_faces, mestypes, sow_auths, faces, roles, lives] = await Promise.all([
    db().collection('message_for_face').find(q).toArray<Document.MessageForFace>(),
    db().collection('message_for_face_mestype').find(q).toArray<Document.MessageForFaceMestype>(),
    db().collection('message_for_face_sow_auth').find(q).toArray<Document.MessageForFaceSowAuth>(),
    db().collection('potof_for_face').find(q).toArray<Document.PotofForFace>(),
    db().collection('potof_for_face_role').find(q).toArray<Document.PotofForFaceRole>(),
    db().collection('potof_for_face_live').find(q).toArray<Document.PotofForFaceLive>()
  ])
  return {
    body: { m_faces, mestypes, sow_auths, faces, roles, lives }
  }
}
