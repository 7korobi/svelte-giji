import type { StoryID } from '../type/id'
import type { Potof } from '../store/potofs'

import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const potofs = modelAsMongoDB<Potof>('potofs')

export const potof_oldlog = {
  ...potofs,
  $match: (story_id: StoryID) => ({
    story_id
  })
}
