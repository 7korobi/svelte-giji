import type { RoleType, LiveType } from '../type/enum'
import type { AccountID, FaceID, MessageTypeIDX, StoryID } from '../type/id'
import type { ISO8601 } from '../type/string'

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
