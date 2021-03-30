import type { CHR_SET_IDS } from '../_dic'
import type { Face, Faces } from './face'

export type Tags = Tag[]
export type Tag = {
  chr_set: ChrSet
  faces: Faces

  chr_set_id: CHR_SET_IDS

  disabled: boolean
  order: number
  head: string
  face_sort: [string, 'asc' | 'desc']
}

export type TagMap = {
  list: Tags
  group: {
    hash: {
      [id: string]: Tag
    }
    list: Tags
  }[][]
}

export type ChrSets = ChrSet[]
export type ChrSet = {}

export type ChrNpcs = ChrNpc[]
export type ChrNpc = {
  chr_job: ChrJob
  face: Face

  chr_job_id: string
  chr_set_id: string
  chr_set_idx: number
  face_id: string
  intro: [string, string] | [string, string, string]

  say_0: string
  say_1: string
  say_2: string
}

export type ChrJobs = ChrJob[]
export type ChrJob = {
  face: Face

  face_id: string
  chr_set_id: string
  chr_set_idx: number
  job: string
}
