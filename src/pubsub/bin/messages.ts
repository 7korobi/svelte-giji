import type { MessageID, StoryID } from '../type/id'
import type { Message } from '../store/messages'

import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const messages = modelAsMongoDB<MessageID, Message>('messages')

export const message_oldlog = {
  ...messages,
  $match: (story_id: StoryID) => ({
    story_id
  })
}
