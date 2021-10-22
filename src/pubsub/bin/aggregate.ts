import type { PotofForFace } from '../store/aggregate'

import { model } from '$lib/db/socket.io-server'
import { db } from '$lib/db'

export const potof_for_face = model({
  $match() {},
  query: () => db().collection<PotofForFace>('potof_for_face').find()
})
