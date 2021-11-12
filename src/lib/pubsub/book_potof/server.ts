import type { STORY_ID, Potof } from '../map-reduce'
import { modelAsMongoDB } from '$lib/db/socket.io-server'

export const potofs = modelAsMongoDB<Potof>('potofs')

export const potof_oldlog = {
  ...potofs,
  $match: (story_id: STORY_ID) => ({
    story_id
  })
}
