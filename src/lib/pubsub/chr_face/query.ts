import { socket } from '$lib/db/socket.io-client'
import {
  message_for_face,
  potof_for_face,
  potof_for_face_sow_auth_max,
  message_for_face_by_face,
  message_for_face_mestype_by_face,
  message_for_face_sow_auth_by_face,
  potof_for_face_by_face,
  potof_for_face_live_by_face,
  potof_for_face_role_by_face
} from '$lib/pubsub/model-client'
import '../client'

export const message_for_face_all = socket(message_for_face).query({})
export const potof_for_face_all = socket(potof_for_face).query({})
export const potof_for_face_sow_auth_max_all = socket(potof_for_face_sow_auth_max).query({})

export function xxx(face_ids: string[]) {
  socket(message_for_face_by_face).query(face_ids)
  socket(message_for_face_mestype_by_face).query(face_ids)
  socket(message_for_face_sow_auth_by_face).query(face_ids)
  socket(potof_for_face_by_face).query(face_ids)
  socket(potof_for_face_role_by_face).query(face_ids)
  socket(potof_for_face_live_by_face).query(face_ids)
}
