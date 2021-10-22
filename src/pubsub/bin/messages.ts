import type { StoryID } from '../type/id'
import type { Message } from '../store/messages'
import { db, model } from '$lib/db'

const table = () => db().collection<Message>('messages')

export const event_oldlog = model({
  $match: (story_id: StoryID) => ({
    story_id
  }),
  qid: (story_id) => story_id,
  query: ($match) => table().find($match)
})
