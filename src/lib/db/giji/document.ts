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
  export type MessageForFace = {
    _id: {
      face_id: FaceID
    }
    date_min: ISO8601
    date_max: ISO8601
    story_ids: StoryID[]
    max: number
    all: number
    count: number
  }
  export type MessageForFaceMestype = {
    _id: {
      face_id: FaceID
      mestype: MessageTypeIDX
    }
    date_min: ISO8601
    date_max: ISO8601
    story_ids: StoryID[]
    max: number
    all: number
    count: number
  }
  export type MessageForFaceSowAuth = {
    _id: {
      face_id: FaceID
      sow_auth_id: AccountID
    }
    date_min: ISO8601
    date_max: ISO8601
    story_ids: StoryID[]
    max: number
    all: number
    count: number
  }

  export type PotofForFace = {
    _id: {
      face_id: FaceID
    }
    date_min: ISO8601
    date_max: ISO8601
    story_ids: StoryID[]
  }
  export type PotofForFaceRole = {
    _id: {
      face_id: FaceID
      role_id: RoleType
    }
    date_min: ISO8601
    date_max: ISO8601
    story_ids: StoryID[]
  }
  export type PotofForFaceLive = {
    _id: {
      face_id: FaceID
      live: LiveType
    }
    date_min: ISO8601
    date_max: ISO8601
    story_ids: StoryID[]
  }
  export type PotofForFaceSowAuthMax = {
    _id: {
      face_id: FaceID
      sow_auth_id: AccountID
    }
    date_min: ISO8601
    date_max: ISO8601
    story_ids: StoryID[]
  }
}

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

  export type Message = {
    _id: MessageID
    story_id: StoryID
    event_id: EventID
    mestype: MesType
    subid: SubType
    logid: MessageIDX
    csid?: CsType
    sow_auth_id: AccountID
    date: string
    size: number
    face_id: FaceID
    style?: StyleType
    name: presentation
    to?: presentation
    log: presentation
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
