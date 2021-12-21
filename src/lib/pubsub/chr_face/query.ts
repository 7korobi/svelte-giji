import { socket } from '$lib/db/socket.io-client'
import { message_for_face, potof_for_face, potof_for_face_sow_auth_max } from '../model-client'
import '../client'

export const message_for_face_all = socket(message_for_face).query({})
export const potof_for_face_all = socket(potof_for_face).query({})
export const potof_for_face_sow_auth_max_all = socket(potof_for_face_sow_auth_max).query({})
