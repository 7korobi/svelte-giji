import type { MesType, SubType, CsType, StyleType } from '../type/enum'
import type { MessageID, StoryID, EventID, MessageIDX, AccountID, FaceID } from '../type/id'
import type { presentation } from '../type/string'

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
