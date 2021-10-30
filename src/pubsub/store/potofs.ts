import type { ObjectId } from 'mongodb'
import type { LiveType, RoleType } from '../type/enum'
import type { StoryID, EventID, AccountID, FaceID, EventIDX, PotofIDX } from '../type/id'
import type { presentation } from '../type/string'

import { model } from '$lib/db/socket.io-client'

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
  story_id: StoryID
  event_id: EventID
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
    entrieddt: Date
    limitentrydt: Date
  }
  say: SayLimit
  jobname?: presentation
  history?: presentation
}

export const potofs = model({
  qid: (ids: ObjectId[]) => ids.toString(),
  format: () => ({
    list: [] as Potof[]
  }),
  reduce: (data, doc: Potof) => {},
  order: (data, { sort }, is_asc: boolean, order: (o: Potof) => any) => {
    if (is_asc) {
      sort(data.list).asc(order)
    } else {
      sort(data.list).desc(order)
    }
    /*
		sort(data.list).asc((o) => o.live)
		sort(data.list).asc((o) => o.deathday)

		sort(data.list).asc((o) => o.clearance)
		sort(data.list).asc((o) => o.zapcount)

		sort(data.list).asc((o) => o.point.actaddpt)

		sort(data.list).asc((o) => o.role[0])
		*/
  }
})
