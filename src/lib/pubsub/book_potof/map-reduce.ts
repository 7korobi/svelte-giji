import type { ObjectId } from 'mongodb'
import type { LiveType, RoleType } from '../_type/enum'
import type { AccountID, FaceID, PotofIDX } from '../_type/id'
import type { presentation } from '../_type/string'
import type { STORY_ID, EVENT_ID, EVENT_IDX } from '../map-reduce'

export type SayLimit = {
  say_act?: number
  say: number
  tsay: number
  spsay?: number
  wsay?: number
  xsay?: number
  gsay?: number
}

export type Potof = {
  _id: ObjectId
  pno: PotofIDX
  story_id: STORY_ID
  event_id: EVENT_ID
  sow_auth_id: AccountID
  face_id: FaceID
  commit: boolean
  csid: string
  select?: RoleType
  role: RoleType[]
  rolestate: number
  live: LiveType
  clearance: number
  zapcount: number
  deathday: EVENT_IDX
  overhear: EVENT_IDX[]
  bonds: PotofIDX[]
  pseudobonds: PotofIDX[]
  point: {
    actaddpt: number
    saidcount: number
    saidpoint: number
  }
  timer: {
    entrieddt: Date
    limitentrydt: Date
  }
  say: SayLimit
  jobname?: presentation
  history?: presentation
}
