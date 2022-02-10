import type {
  MessageForFace,
  MessageForFaceMestype,
  MessageForFaceSowAuth,
  PotofForFace,
  PotofForFaceLive,
  PotofForFaceRole,
  PotofForFaceSowAuthMax
} from '../map-reduce'
import type { DIC } from '$lib/map-reduce'
import { model } from '$lib/db/socket.io-client'
import { dic } from '$lib/map-reduce'
import type { FaceID } from '../_type/id'

export const potof_for_face = model({
  qid: (o: Partial<PotofForFace['_id']>) => [o.face_id].toString(),
  format: () => ({
    list: [] as PotofForFace[],
    by_face: {} as DIC<PotofForFace>
  }),
  reduce: (data, doc) => {
    dic(data.by_face, doc._id.face_id, doc)
  },
  order: (data, { sort }) => {}
})

export const potof_for_face_role = model({
  qid: (o: Partial<PotofForFaceRole['_id']>) => [o.face_id, o.role_id].toString(),
  format: () => ({
    list: [] as PotofForFaceRole[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const potof_for_face_live = model({
  qid: (o: Partial<PotofForFaceLive['_id']>) => [o.face_id, o.live].toString(),
  format: () => ({
    list: [] as PotofForFaceLive[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const potof_for_face_sow_auth_max = model({
  qid: (o: Partial<PotofForFaceSowAuthMax['_id']>) => [o.face_id, o.sow_auth_id].toString(),
  format: () => ({
    list: [] as PotofForFaceSowAuthMax[],
    by_face: {} as DIC<PotofForFaceSowAuthMax>
  }),
  reduce: (data, doc) => {
    dic(data.by_face, doc._id.face_id, doc)
  },
  order: (data, { sort }) => {}
})

export const message_for_face = model({
  qid: (o: Partial<MessageForFace['_id']>) => [o.face_id].toString(),
  format: () => ({
    list: [] as MessageForFace[],
    by_face: {} as DIC<MessageForFace>
  }),
  reduce(data, doc) {
    dic(data.by_face, doc._id.face_id, doc)
  },
  order(data, { sort }) {}
})

export const message_for_face_mestype = model({
  qid: (o: Partial<MessageForFaceMestype['_id']>) => [o.face_id, o.mestype].toString(),
  format: () => ({
    list: [] as MessageForFaceMestype[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {}
})

export const message_for_face_sow_auth = model({
  qid: (o: Partial<MessageForFaceSowAuth['_id']>) => [o.face_id, o.sow_auth_id].toString(),
  format: () => ({
    list: [] as MessageForFaceSowAuth[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {}
})

export const message_for_face_by_face = model({
  qid: (ids: FaceID[]) => ids.toString(),
  format: () => ({
    list: [] as MessageForFace[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {}
})

export const message_for_face_mestype_by_face = model({
  qid: (ids: FaceID[]) => ids.toString(),
  format: () => ({
    list: [] as MessageForFaceMestype[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {}
})

export const message_for_face_sow_auth_by_face = model({
  qid: (ids: FaceID[]) => ids.toString(),
  format: () => ({
    list: [] as MessageForFaceSowAuth[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {}
})

export const potof_for_face_by_face = model({
  qid: (ids: FaceID[]) => ids.toString(),
  format: () => ({
    list: [] as PotofForFace[],
    by_face: {} as DIC<PotofForFace>
  }),
  reduce: (data, doc) => {
    dic(data.by_face, doc._id.face_id, doc)
  },
  order: (data, { sort }) => {}
})

export const potof_for_face_role_by_face = model({
  qid: (ids: FaceID[]) => ids.toString(),
  format: () => ({
    list: [] as PotofForFaceRole[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const potof_for_face_live_by_face = model({
  qid: (ids: FaceID[]) => ids.toString(),
  format: () => ({
    list: [] as PotofForFaceLive[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})
