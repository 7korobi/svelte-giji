import type { ARY, DIC } from '$lib/map-reduce'
import type { presentation } from '../type/string'

import type { ChrJobID, ChrSetID, FaceID } from '../type/id'
import type { Face } from './chr_face'

import { model } from '$lib/db/socket.io-client'
import { MapReduce, dic } from '$lib/map-reduce'

import ririnra from '$lib/game/json/cs_ririnra.json'
import wa from '$lib/game/json/cs_wa.json'
import time from '$lib/game/json/cs_time.json'
import sf from '$lib/game/json/cs_sf.json'
import fable from '$lib/game/json/cs_fable.json'
import mad from '$lib/game/json/cs_mad.json'
import ger from '$lib/game/json/cs_ger.json'
import changed from '$lib/game/json/cs_changed.json'

import animal from '$lib/game/json/cs_animal.json'
import school from '$lib/game/json/cs_school.json'
import all from '$lib/game/json/cs_all.json'

import { Faces } from './chr_face'

const order = [
  'ririnra',
  'wa',
  'time',
  'sf',
  'fable',
  'mad',
  'ger',
  'changed',
  'animal',
  'school',
  'all'
]

const cs = { ririnra, wa, time, sf, fable, mad, ger, changed, animal, school, all }

export type ChrSet = {
  _id: ChrSetID
  admin: presentation
  maker: presentation
  label: presentation
}

export type ChrNpc = {
  _id: ChrJobID
  csid: ChrSetID
  face_id: FaceID
  chr_set_id: ChrSetID
  chr_set_idx: number
  label: presentation
  intro: presentation[]
  say_0: presentation
  say_1: presentation
  say_2?: presentation
}

export type ChrJob = {
  _id: ChrJobID
  face_id: FaceID
  chr_set_id: ChrSetID
  chr_set_idx: number
  job: presentation
  search_words: string
}

export const ChrSets = MapReduce({
  format: () => ({
    list: [] as ChrSet[]
  }),
  reduce: (data, doc: ChrSet) => {},
  order: (data, cmd) => {}
})

export const ChrNpcs = MapReduce({
  format: () => ({
    list: [] as ChrNpc[]
  }),
  reduce: (data, doc: ChrNpc) => {},
  order: (data, cmd) => {}
})

export const ChrJobs = MapReduce({
  format: () => ({
    list: [] as ChrJob[],
    face: {} as DIC<ChrJob[]>
  }),
  reduce: (data, doc: ChrJob) => {
    const face = Faces.find(doc.face_id)
    doc.search_words = face
      ? ['animal', 'school'].includes(doc.chr_set_id)
        ? face.name
        : `${doc.job} ${face.name}`
      : ''

    dic(data.face, doc.face_id, []).push(doc)
  },
  order: (data, { sort }) => {
    for (const face_id in data.face) {
      sort(data.face[face_id]).asc((o) => o.chr_set_idx)
    }
  }
})

order.forEach((key, idx) => {
  const o = cs[key]
  const chr_set_id = o.chr_set._id
  const chr_set_idx = order.indexOf(chr_set_id)

  const npcs: ChrNpc[] = o.chr_npc.map<ChrNpc>((doc) => {
    const chr_job_id = `${chr_set_id}_${doc.face_id}`
    const intro = [doc.say_0, doc.say_1]
    if (doc.say_2) intro.push(doc.say_2)

    return { _id: chr_job_id, ...doc, chr_set_id, chr_set_idx, intro }
  })
  const jobs: ChrJob[] = o.chr_job.map<ChrJob>((doc) => {
    return { ...doc, _id: `${chr_set_id}_${doc.face_id}`, chr_set_id, chr_set_idx }
  })

  ChrSets.add([o.chr_set])
  ChrNpcs.add(npcs)
  ChrJobs.add(jobs)
})

const chr_set_idx = order.length - 1
ChrJobs.add(
  Faces.data.list.map<ChrJob>((face) => {
    const job = ChrJobs.data.face[face._id][0]?.job
    return {
      _id: `all_${face._id}`,
      job,
      face_id: face._id,
      chr_set_id: 'all',
      chr_set_idx,
      search_words: ''
    }
  })
)

ChrJobs.data.list.forEach((o) => {
  if (o.chr_set_id !== 'ririnra') return
  const face = Faces.find(o.face_id)
})

console.log({ ChrSets, ChrNpcs, ChrJobs })