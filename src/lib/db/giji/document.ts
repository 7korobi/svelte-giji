import type { ISO8601, presentation } from '$lib/config'

import type {
  StoryID,
  AccountID,
  MessageID,
  EventID,
  MessageIDX,
  FaceID,
  EventIDX,
  PotofIDX,
  MessageTypeIDX
} from './id'
import type { SubType, RoleType, MesType, CsType, LiveType, StyleType } from './type'

export namespace Document {
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
    _id: string
    pno: PotofIDX
    story_id: StoryID
    event_id: EventID
    sow_auth_id: AccountID
    face_id: FaceID
    commit: boolean
    csid: CsType
    select?: RoleType
    role: RoleType[]
    rolestate: number
    live: LiveType
    clearance: number
    zapcount: number
    deathday: EventIDX
    overhear: EventIDX[]
    bonds: PotofIDX[]
    pseudobonds: PotofIDX[]
    point: {
      actaddpt: number
      saidcount: number
      saidpoint: number
    }
    timer: {
      entrieddt: ISO8601
      limitentrydt: ISO8601
    }
    say: Document.SayLimit
    jobname?: presentation
    history?: presentation
  }
}
