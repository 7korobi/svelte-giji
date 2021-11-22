import type { MessageForFace, PotofForFace, PotofForFaceSowAuthMax } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export const message_for_face = model({
  qid: (o: PotofForFace['_id']) => o.face_id,
  format: () => ({
    list: [] as MessageForFace[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {}
})

export const potof_for_face = model({
  qid: (o: PotofForFace['_id']) => o.face_id,
  format: () => ({
    list: [] as PotofForFace[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const potof_for_face_sow_auth_max = model({
  qid: (o: PotofForFaceSowAuthMax['_id']) => [o.face_id, o.sow_auth_id].toString(),
  format: () => ({
    list: [] as PotofForFaceSowAuthMax[]
  }),
  reduce(data, doc) {},
  order(data, { sort }) {}
})
