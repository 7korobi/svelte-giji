import type { PotofForFace } from '../store/aggregate'
import { db, model } from '$lib/db'

export const potof_for_face = model({
  $match() {},
  qid: () => '',
  query: () => db().collection<PotofForFace>('potof_for_face').find()
})
