import type { ARY, DIC } from '$lib/map-reduce'
import type { presentation } from '../type/string'
import type { FaceID } from '../type/id'
import type { Face } from '.'

import { MapReduce, dic } from '$lib/map-reduce'
import { Faces } from '../map-reduce'

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

export type CHR_SET_IDX = typeof CHR_SET_IDS[number]
export type CSID = typeof CSIDS[number]
export type CHR_JOB_ID = `${CHR_SET_IDX}_${FaceID}`

export type ChrSet = {
  _id: CHR_SET_IDX
  npcs: ChrNpc[]
  admin: presentation
  maker: presentation
  label: presentation
}

export type ChrNpc = {
  _id: CHR_JOB_ID
  csid: CSID
  face_id: FaceID
  face?: Face
  chr_set_id: CHR_SET_IDX
  chr_set?: ChrSet
  chr_set_at: number
  chr_job?: ChrJob
  label: presentation
  intro: presentation[]
  say_0: presentation
  say_1: presentation
  say_2?: presentation
}

export type ChrJob = {
  _id: CHR_JOB_ID
  face_id: FaceID
  face?: Face
  chr_set_id: CHR_SET_IDX
  chr_set?: ChrSet
  chr_set_at: number
  job: presentation
  head?: string
  search_words?: string
}

const cs = { ririnra, wa, time, sf, fable, mad, ger, changed, animal, school, all }

export const CHR_SET_IDS = [
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
] as const

export const CSIDS = [
  'ririnra',
  'ririnra_c01',
  'ririnra_c05',
  'ririnra_c08',
  'ririnra_c19',
  'ririnra_c67',
  'ririnra_c68',
  'ririnra_c72',
  'ririnra_c51',
  'ririnra_c20',
  'ririnra_c32',
  'all',
  'mad',
  'mad_mad05',
  'time',
  'ger',
  'animal',
  'school',
  'changed',
  'changed_m05',
  'SF',
  'SF_sf10',
  'wa',
  'wa_w23'
] as const

export const ChrSets = MapReduce({
  format: () => ({
    list: [] as ChrSet[],
    by_label: [] as ARY<ARY<ChrSet>>
  }),
  reduce: (data, doc) => {
    const is_expantion_set = /^エクスパンション・セット/.test(doc.label)
    if (doc._id !== 'all') dic(data.by_label, is_expantion_set ? 1 : 0, []).push(doc)
  },
  order: (data, { sort }) => {}
})

export const ChrNpcs = MapReduce({
  format: () => ({
    list: [] as ChrNpc[],
    chr_set: {} as DIC<{ list: ChrNpc[] }>
  }),
  reduce: (data, doc) => {
    dic(data.chr_set, doc.chr_set_id, {}, 'list', []).push(doc)
  },
  order: (data, cmd) => {}
})

export const ChrJobs = MapReduce({
  format: () => ({
    list: [] as ChrJob[],
    face: {} as DIC<ChrJob[]>
  }),
  reduce: (data, doc) => {
    dic(data.face, doc.face_id, []).push(doc)
  },
  order: (data, { sort }) => {
    for (const face_id in data.face) {
      sort(data.face[face_id]).asc((o) => o.chr_set_at)
    }
  }
})

CHR_SET_IDS.forEach((key, idx) => {
  const o = cs[key]
  const chr_set_id = o.chr_set._id as CHR_SET_IDX
  const chr_set_at = CHR_SET_IDS.indexOf(chr_set_id)

  const npcs: ChrNpc[] = o.chr_npc.map<ChrNpc>((doc) => {
    const chr_job_id = `${chr_set_id}_${doc.face_id}`
    const intro = [doc.say_0, doc.say_1].map((text) => text.split('\n').join('<BR/>'))
    if (doc.say_2) intro.push(doc.say_2)

    return { _id: chr_job_id, ...doc, chr_set_id, chr_set_at, intro }
  })
  const jobs: ChrJob[] = o.chr_job.map<ChrJob>((doc) => {
    return { ...doc, _id: `${chr_set_id}_${doc.face_id}`, chr_set_id, chr_set_at }
  })

  ChrSets.add([o.chr_set as any])
  ChrNpcs.add(npcs)
  ChrJobs.add(jobs)
})

const chr_set_at = CHR_SET_IDS.length - 1
ChrJobs.add(
  Faces.data.list.map<ChrJob>((face) => {
    const job = ChrJobs.data.face[face._id][0]?.job
    return {
      _id: `all_${face._id}`,
      job,
      face_id: face._id,
      chr_set_id: 'all',
      chr_set_at,
      search_words: ''
    }
  }).filter((o)=> !ChrJobs.find(o._id))
)
