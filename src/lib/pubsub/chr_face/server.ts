import type {
  MessageForFace,
  MessageForFaceMestype,
  MessageForFaceSowAuth,
  PotofForFace,
  PotofForFaceLive,
  PotofForFaceRole,
  PotofForFaceSowAuthMax
} from '../map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

function modelAsAggregate<T extends { _id: any }>(collection: string) {
  const { isLive, live, query } = modelAsMongoDB<T>(collection)
  return {
    isLive,
    live,
    query,
    $match(o: T['_id']): { [idx in `_id.${string}`]: { $in: string[] } } {
      const ret: T['_id'] = {}
      for (const key in o) {
        ret[`_id.${key}`] = { $in: o[key] }
      }
      return ret
    }
  }
}

export const potof_for_face = modelAsAggregate<PotofForFace>('potof_for_face')
export const potof_for_face_role = modelAsAggregate<PotofForFaceRole>('potof_for_face_role')
export const potof_for_face_live = modelAsAggregate<PotofForFaceLive>('potof_for_face_live')
export const potof_for_face_sow_auth_max = modelAsAggregate<PotofForFaceSowAuthMax>(
  'potof_for_face_sow_auth_max'
)

export const message_for_face = modelAsAggregate<MessageForFace>('message_for_face')
export const message_for_face_mestype = modelAsAggregate<MessageForFaceMestype>(
  'message_for_face_mestype'
)
export const message_for_face_sow_auth = modelAsAggregate<MessageForFaceSowAuth>(
  'message_for_face_sow_auth'
)
