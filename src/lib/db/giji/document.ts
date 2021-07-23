import type { ISO8601, presentation, URL } from '$lib/config'

import type {
  StoryID,
  FolderIDX,
  StoryIDX,
  AccountID,
  MessageID,
  EventID,
  MessageIDX,
  FaceID,
  EventIDX,
  PotofIDX,
  MessageTypeIDX
} from './id'
import type {
  SubType,
  MoodType,
  OptionType,
  SayType,
  VoteType,
  RoleTableType,
  MobType,
  GameType,
  EventType,
  RoleType,
  MesType,
  CsType,
  WinType,
  LiveType,
  StyleType
} from './type'

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
  export type Plan = {
    _id: string
    link: URL
    write_at: ISO8601
    title: presentation
    name: presentation
    state?: presentation
    chip?: presentation
    sign: AccountID
    card: presentation[]
    upd: {
      description?: presentation
      time?: presentation
      interval?: presentation
      prologue?: presentation
      start?: presentation
    }
    lock: presentation[]
    flavor: presentation[]
    options: presentation[]
    tags: presentation[][]
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

  export type Story = {
    _id: StoryID
    folder: Uppercase<FolderIDX>
    vid: StoryIDX
    sow_auth_id: AccountID
    is_epilogue: boolean
    is_finish: boolean
    is_full_commit: boolean
    vpl: [number, number]
    rating: MoodType
    options: OptionType[]
    type: {
      say: SayType
      vote: VoteType
      roletable: RoleTableType
      mob: MobType
      game: GameType
    }
    upd: {
      interval: number
      hour: number
      minute: number
    }
    card: {
      event: EventType[]
      discard: RoleType[]
      config: RoleType[]
    }
    timer: {
      updateddt: ISO8601
      nextupdatedt: ISO8601
      nextchargedt: ISO8601
      nextcommitdt: ISO8601
      scraplimitdt: ISO8601
    }
    name: presentation
    comment: presentation
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

  export type Event = {
    _id: EventID
    story_id: StoryID
    turn: EventIDX
    winner: WinType
    created_at: ISO8601
    updated_at: ISO8601
    event?: null
    epilogue?: 0 | -1
    grudge?: 0 | -1
    riot?: 0 | -1
    scapegoat?: 0 | -1
    eclipse?: EventIDX[]
    seance?: EventIDX[]
    say?: {
      modifiedsay: ISO8601
      modifiedwsay?: ISO8601
      modifiedgsay?: ISO8601
      modifiedspsay?: ISO8601
      modifiedxsay?: ISO8601
      modifiedvsay?: ISO8601
    }
    name?: presentation
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
