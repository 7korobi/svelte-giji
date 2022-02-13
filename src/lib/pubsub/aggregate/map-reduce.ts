import type { AccountID, FaceID } from '../_type/id'
import type { Role, MesType, LIVE_ID, ROLE_ID, BOOK_STORY_ID } from '../map-reduce'
import { model } from '$lib/db/socket.io-client'

export type MessageForFace = {
  _id: {
    face_id: FaceID
  }
  date_min: Date
  date_max: Date
  story_ids: BOOK_STORY_ID[]
  max: number
  all: number
  count: number
}
export type MessageForFaceMestype = {
  _id: {
    face_id: FaceID
    mestype: MesType
  }
  date_min: Date
  date_max: Date
  story_ids: BOOK_STORY_ID[]
  per: number
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
  story_ids: BOOK_STORY_ID[]
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
  story_ids: BOOK_STORY_ID[]
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
  story_ids: BOOK_STORY_ID[]
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
  story_ids: BOOK_STORY_ID[]
}
export type PotofForFaceSowAuthMax = {
  _id: {
    face_id: FaceID
    sow_auth_id: AccountID
  }
  date_min: Date
  date_max: Date
  story_ids: BOOK_STORY_ID[]
  count: number
}
export type PotofForFaceRole = {
  _id: {
    face_id: FaceID
    role_id: ROLE_ID
  }
  role: Role
  date_min: Date
  date_max: Date
  story_ids: BOOK_STORY_ID[]
}
export type PotofForFaceLive = {
  _id: {
    face_id: FaceID
    live: LIVE_ID
  }
  live: Role
  date_min: Date
  date_max: Date
  story_ids: BOOK_STORY_ID[]
}

export const potof_for_faces = model({
  format: () => ({
    list: [] as PotofForFace[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})
