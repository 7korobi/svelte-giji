import type { ModelEntry } from '$lib/db'
import { db, watch } from '$lib/db'

import type { AccountID, EventID, FolderIDX, StoryID, StoryIDX } from '$lib/db/giji/id'
import type {
  EventType,
  GameType,
  MobType,
  MoodType,
  OptionType,
  RoleTableType,
  RoleType,
  SayType,
  VoteType
} from '$lib/db/giji/type'
import type { ISO8601, presentation } from '$lib/config'

export type SecureStory = {
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
}

export type Story = SecureStory & {
  password: presentation
  comment: presentation
}

function model() {
  return db().collection<SecureStory>('stories')
}
async function upsert($set: Story) {
  const res = await model().findOneAndUpdate({ _id: $set._id }, { $set }, { upsert: true })
  return res.ok ? res.value : null
}

function $match() {
  return {
    is_epilogue: false,
    is_finish: false
  }
}

export default {
  $match,
  qid: () => '',

  isLive: async () => true,
  live: ($match, set, del) => watch(set, del, model, [{ $match }]),

  async query($match) {
    return await model()
      .find($match)
      .project<SecureStory>({ comment: 0, password: 0 })
      .toArray()
  },

  async set(docs) {
    const res = await Promise.all(docs.map(upsert))
    const errors = docs.filter((doc, idx) => !res[idx])
    return { errors }
  },

  async del(ids) {
    const res = await model().deleteMany({ _id: ids })
    const errors = res.deletedCount ? ids : []
    return { errors }
  }
} as ModelEntry<[], StoryID, SecureStory, ReturnType<typeof $match>>
