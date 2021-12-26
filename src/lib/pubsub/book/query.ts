import type { DIC } from '$lib/map-reduce'
import type { BOOK_EVENT_ID, BookStory } from '../map-reduce'
import { socket } from '$lib/db/socket.io-client'
import { lookup } from '$lib/map-reduce'
import { dic } from '$lib/map-reduce'
import { Folders } from '../map-reduce'
import { events, story_summary } from '../model-client'
import '../client'

const prologue_id = (o: BookStory) => `${o._id}-0` as BOOK_EVENT_ID

export const story_summary_all = socket(story_summary).query(false)

export const story_reduce = lookup({
  format: () => ({
    prologue: { list: [] } as DIC<number> & { list: BookStory[] },
    progress: { list: [] } as DIC<number> & { list: BookStory[] }
  }),
  order(data, { sort }) {},
  subscribe(set, { format }) {
    story_summary_all.subscribe(($story) => {
      if (!$story.list.length) return
      const prologue_ids = $story.list.map(prologue_id)
      const _events = socket(events).query(prologue_ids)

      _events.subscribe(($event) => {
        const data = format()
        for (const doc of $story.list) {
          doc.folder = Folders.find(doc.folder_id)
          doc.prologue = _events.find(prologue_id(doc))
          const idx = doc.prologue ? 'progress' : 'prologue'

          dic(data[idx] as { list: BookStory[] }, 'list', []).push(doc)
          data[idx][doc.folder_id] ||= 0
          data[idx][doc.folder_id]++
        }
        set(data)
      })
    })
  }
})
