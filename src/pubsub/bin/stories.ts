import type { StoryID } from '../type/id'
import type { Story } from '../store/stories'
import { db, watch, model } from '$lib/db'

const $project = { comment: 0, password: 0 }
const set = ($set: Story) => table().findOneAndUpdate({ _id: $set._id }, { $set }, { upsert: true })
const del = (ids: StoryID[]) => table().deleteMany({ _id: ids })
const table = () => db().collection<Story>('stories')

export const story_summary = model({
  $match: (is_old: boolean) => ({
    is_epilogue: is_old,
    is_finish: is_old
  }),
  qid: (is_old) => '',

  set,
  del,
  isLive: async () => true,
  live: ($match, set, del) => watch(set, del, table, [{ $match }, { $project }]),
  query: ($match) => table().find($match).project<Story>($project)
})

export const story_oldlog = model({
  $match: (_id: StoryID) => ({
    _id
  }),
  qid: (_id) => _id,
  query: ($match) => table().find($match).project<Story>($project)
})
