import type { MesType, SubType, StyleType } from '../type/enum'
import type { MessageID, StoryID, EventID, MessageIDX, AccountID, FaceID } from '../type/id'
import type { presentation } from '../type/string'

import { model } from '$lib/db/socket.io-client'

export type Message = {
  _id: MessageID
  story_id: StoryID
  event_id: EventID
  mestype: MesType
  subid: SubType
  logid: MessageIDX
  csid?: string
  sow_auth_id: AccountID
  date: Date
  size: number
  face_id: FaceID
  style?: StyleType
  name: presentation
  to?: presentation
  log: presentation
}

export const message_oldlog = model({
  qid: (story_id) => story_id,
  format: () => ({
    list: [] as Message[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {
    sort(data.list).asc((o) => o.date)
  }
})
