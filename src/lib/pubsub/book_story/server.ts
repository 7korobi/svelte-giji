import type { BookStory } from '../map-reduce'
import { model, modelAsMongoDB } from '$lib/db/socket.io-server'

export const stories = modelAsMongoDB<BookStory>('stories', {
  comment: 0,
  password: 0,
  sow_auth_id: 0
})

export const story_summary = model({
  ...stories,
  $match: (is_old: boolean) => ({
    is_epilogue: is_old,
    is_finish: is_old
  }),

  isLive: async () => true
})
