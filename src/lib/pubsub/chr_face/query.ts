import { socket } from '$lib/db/socket.io-client'
import {
  message_for_face_mestype,
  message_for_face_sow_auth,
  message_for_face,
  potof_for_face_live,
  potof_for_face_role,
  potof_for_face_sow_auth_max,
  potof_for_face
} from '$lib/pubsub/model-client'
import '../client'

const message = socket(message_for_face)
const potof = socket(potof_for_face)
const potof_sow_auth_max = socket(potof_for_face_sow_auth_max)
const message_mestype = socket(message_for_face_mestype)
const message_sow_auth = socket(message_for_face_sow_auth)
const potof_role = socket(potof_for_face_role)
const potof_live = socket(potof_for_face_live)

export const for_face = {
  message: message.query({}),
  potof: potof.query({}),
  potof_sow_auth_max: potof_sow_auth_max.query({})
}

export function by_face(face_id?: string) {
  const query = {
    face_id: face_id ? [face_id] : []
  }
  return {
    message: message.query(query),
    message_mestype: message_mestype.query(query),
    message_sow_auth: message_sow_auth.query(query),
    potof: potof.query(query),
    potof_role: potof_role.query(query),
    potof_live: potof_live.query(query)
  }
}
