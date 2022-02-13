import type { DIC } from 'svelte-map-reduce-store'
import type {
  BookStory,
  BOOK_FOLDER_IDX,
  BOOK_STORY_ID,
  BOOK_STORY_IDX,
  BOOK_EVENT_ID,
  BOOK_EVENT_IDX,
  BOOK_PHASE_ID,
  BOOK_PHASE_IDX,
  BOOK_MESSAGE_ID,
  BOOK_MESSAGE_IDX
} from '../map-reduce'
import { socket } from '$lib/db/socket.io-client'
import { lookup } from 'svelte-map-reduce-store'
import { dic } from 'svelte-map-reduce-store'
import { subids } from '../util'
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

export function book_ids(idx: string) {
  return subids<
    [
      [BOOK_FOLDER_IDX, BOOK_STORY_ID, BOOK_EVENT_ID, BOOK_PHASE_ID, BOOK_MESSAGE_ID],
      [BOOK_FOLDER_IDX, BOOK_STORY_IDX, BOOK_EVENT_IDX, BOOK_PHASE_IDX, BOOK_MESSAGE_IDX]
    ]
  >(idx)
}
