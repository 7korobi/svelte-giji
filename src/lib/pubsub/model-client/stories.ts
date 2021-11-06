import type { DIC } from '$lib/map-reduce'
import type { Story } from '../map-reduce'
import { dic } from '$lib/map-reduce'
import { model } from '$lib/db/socket.io-client'

export const stories = model({
  qid: (ids) => ids.toString,
  format: () => ({
    list: [] as Story[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const story_summary = model({
  qid: (is_old: boolean) => is_old.toString(),
  format: () => ({
    list: [] as Story[],
    folder: {} as DIC<{ list: Story[] }>
  }),
  reduce: (data, doc) => {
    dic(data.folder, doc.folder.toLowerCase(), {}, 'list', []).push(doc)
  },
  order: (data, { sort }) => {
    sort(data.list).desc((o) => o.timer.nextcommitdt)
  }
})
