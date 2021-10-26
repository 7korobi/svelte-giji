import type { Story } from '../store/stories'

import { modelAsMongoDB } from '$lib/db/socket.io-server'
import {} from './events'

export const stories = modelAsMongoDB<Story>('stories', { comment: 0, password: 0 })

export const story_summary = {
  ...stories,
  $match: (is_old: boolean) => ({
    is_epilogue: is_old,
    is_finish: is_old
  }),

  isLive: async () => true
}
