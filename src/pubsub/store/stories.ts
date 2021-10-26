import type {
  MoodType,
  OptionType,
  SayType,
  VoteType,
  RoleTableType,
  MobType,
  GameType,
  EventType,
  RoleType
} from '../type/enum'
import type { StoryID, FolderIDX, StoryIDX, AccountID } from '../type/id'
import type { presentation } from '../type/string'

import { model } from '$lib/db/socket.io-client'

export type Story = {
  _id: StoryID
  folder: Uppercase<FolderIDX>
  vid: StoryIDX
  sow_auth_id: AccountID

  password?: presentation
  comment?: presentation

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
    updateddt: Date
    nextupdatedt: Date
    nextchargedt: Date
    nextcommitdt: Date
    scraplimitdt: Date
  }
  name: presentation
}

export const stories = model({
  qid: (ids) => ids.toString,
  format: () => ({
    list: [] as Story[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const story_summary = model({
  qid: (is_old) => is_old.toString(),
  format: () => ({
    list: [] as Story[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {
    sort(data.list).desc((o) => o.timer.nextcommitdt)
  }
})
