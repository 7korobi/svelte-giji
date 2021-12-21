import type { STORY_ID } from '../book_story/map-reduce'
import type { RoleType, LiveType } from '../_type/enum'
import type { AccountID, FaceID } from '../_type/id'
import type { presentation } from '../_type/string'
import type { FOLDER_IDX, MESSAGE_TYPE_IDX, MesType } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export type MessageForFace = {
  _id: {
    face_id: FaceID
  }
  date_min: Date
  date_max: Date
  story_ids: STORY_ID[]
  max: number
  all: number
  count: number
}
export type MessageForFaceMestype = {
  _id: {
    face_id: FaceID
    mestype: MESSAGE_TYPE_IDX
  }
  date_min: Date
  date_max: Date
  story_ids: STORY_ID[]
  max: number
  all: number
  count: number
}
export type MessageForFaceSowAuth = {
  _id: {
    face_id: FaceID
    sow_auth_id: AccountID
  }
  date_min: Date
  date_max: Date
  story_ids: STORY_ID[]
  max: number
  all: number
  count: number
}

export type MessageForFaceLive = {
  _id: {
    face_id: FaceID
    sow_auth_id: AccountID
  }
  date_min: Date
  date_max: Date
  story_ids: STORY_ID[]
  max: number
  all: number
  count: number
}

export type MessageForFaceRole = {
  _id: {
    face_id: FaceID
    sow_auth_id: AccountID
  }
  date_min: Date
  date_max: Date
  story_ids: STORY_ID[]
  max: number
  all: number
  count: number
}

export type PotofForFace = {
  _id: {
    face_id: FaceID
  }
  date_min: Date
  date_max: Date
  story_ids: STORY_ID[]
}
export type PotofForFaceSowAuthMax = {
  _id: {
    face_id: FaceID
    sow_auth_id: AccountID
  }
  date_min: Date
  date_max: Date
  story_ids: STORY_ID[]
  count: number
}
export type PotofForFaceRole = {
  _id: {
    face_id: FaceID
    role_id: RoleType
  }
  date_min: Date
  date_max: Date
  story_ids: STORY_ID[]
}
export type PotofForFaceLive = {
  _id: {
    face_id: FaceID
    live: LiveType
  }
  date_min: Date
  date_max: Date
  story_ids: STORY_ID[]
}

export type Aggregate = {
  folders: FOLDER_IDX
  roles: RoleType[]
  lives: LiveType[]
  sow_auths: presentation[]
  mestypes: MesType[]
  log: {
    story_ids: STORY_ID[]
    date_max: Date
    date_min: Date
  }
  fav: {
    _id: {
      sow_auth_id?: presentation
    }
    count: number
  }
}

export const potof_for_faces = model({
  format: () => ({
    list: [] as PotofForFace[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})
