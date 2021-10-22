import type { StoryID } from '../type/id'
import type { Message } from '../store/messages'

import { model } from '$lib/db/socket.io-server'
import { db } from '$lib/db'

const table = () => db().collection<Message>('messages')

export const message_oldlog = model({
  $match: (story_id: StoryID) => ({
    story_id
  }),
  query: ($match) => table().find($match)
})
