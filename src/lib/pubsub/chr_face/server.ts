import type {
  MessageForFace,
  MessageForFaceMestype,
  PotofForFace,
  PotofForFaceLive,
  PotofForFaceRole,
  PotofForFaceSowAuthMax
} from '../aggregate/map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const message_for_face = modelAsMongoDB<MessageForFace>('message_for_face')
export const message_for_face_mestype = modelAsMongoDB<MessageForFaceMestype>('message_for_face')
export const message_for_face_sow_auth = modelAsMongoDB<MessageForFace>('message_for_face')

export const potof_for_face = modelAsMongoDB<PotofForFace>('potof_for_face')
export const potof_for_face_role = modelAsMongoDB<PotofForFaceRole>('potof_for_face_role')
export const potof_for_face_live = modelAsMongoDB<PotofForFaceLive>('potof_for_face_live')
export const potof_for_face_sow_auth_max = modelAsMongoDB<PotofForFaceSowAuthMax>(
  'potof_for_face_sow_auth_max'
)
