import type { RoleType, LiveType, MesType } from '../type/enum'
import type { AccountID, FaceID, FolderIDX, MessageTypeIDX, StoryID } from '../type/id'
import type { presentation } from '../type/string'

export type MessageForFace = {
  _id: {
    face_id: FaceID
  }
  date_min: Date
  date_max: Date
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
  date_min: Date
  date_max: Date
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
  date_min: Date
  date_max: Date
  story_ids: StoryID[]
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
  story_ids: StoryID[]
}
export type PotofForFaceSowAuthMax = {
  _id: {
    face_id: FaceID
    sow_auth_id: AccountID
  }
  date_min: Date
  date_max: Date
  story_ids: StoryID[]
}
export type PotofForFaceRole = {
  _id: {
    face_id: FaceID
    role_id: RoleType
  }
  date_min: Date
  date_max: Date
  story_ids: StoryID[]
}
export type PotofForFaceLive = {
  _id: {
    face_id: FaceID
    live: LiveType
  }
  date_min: Date
  date_max: Date
  story_ids: StoryID[]
}

export type Aggregate = {
  folders: FolderIDX
  roles: RoleType[]
  lives: LiveType[]
  sow_auths: presentation[]
  mestypes: MesType[]
  log: {
    story_ids: StoryID[]
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
