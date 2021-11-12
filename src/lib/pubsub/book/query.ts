import type { DIC } from '$lib/map-reduce'
import type { EVENT_ID, Folder, Story } from '../map-reduce'
import { Folders } from '../map-reduce'
import { writable } from 'svelte/store'
import { socket } from '$lib/db/socket.io-client'
import { dic } from '$lib/map-reduce'
import { events, story_summary } from '../model-client'
import '../client'

const prologue_id = (o: Story) => `${o._id}-0` as EVENT_ID

export const story_summary_all = socket(story_summary).query(false)

type story_reduce = {
  prologue: DIC<number> & { list: [Story, Folder][] }
  progress: DIC<number> & { list: [Story, Folder][] }
}
export const story_reduce = writable({} as story_reduce)

story_summary_all.subscribe(($story) => {
  const prologue_ids = $story.list.map(prologue_id)
  const event_summary_all = socket(events).query(prologue_ids)

  const chk_turn = (o: Story) => (event_summary_all.find(prologue_id(o)) ? 'progress' : 'prologue')
  event_summary_all.subscribe(($event) => {
    const data = {
      prologue: {},
      progress: {}
    } as story_reduce
    for (const story of $story.list) {
      const folder_id = story.folder.toLowerCase()
      const folder = Folders.find(folder_id as Folder['_id'])

      const idx = chk_turn(story)
      dic<[Story, Folder][]>(data as any, idx, {}, 'list', []).push([story, folder])
      data[idx][folder_id] ||= 0
      data[idx][folder_id]++
    }
    story_reduce.set(data)
  })
})
