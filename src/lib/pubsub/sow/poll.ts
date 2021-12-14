import type { STORY_ID, Story, Event, Message, Potof, PotofForFace } from '../map-reduce'
import { MapReduce } from '$lib/map-reduce'
import site from '$lib/site'
import { stories, events, messages, potofs } from '../model-client'
import { potof_for_faces } from '../map-reduce'

let oldlog_url = ''

site.url.subscribe(({ oldlog }) => {
  oldlog_url = oldlog
})

export const oldlogs_stories = MapReduce(stories)
export const oldlogs_faces = MapReduce(potof_for_faces)

export const oldlog_stories = MapReduce(stories)
export const oldlog_events = MapReduce(events)
export const oldlog_messages = MapReduce(messages)
export const oldlog_potofs = MapReduce(potofs)

export function oldlogs() {
  return {
    version: '1.0.0',
    timer: '12h',
    shift: '1h10m',
    idx: `${oldlog_url}sow/index.json`,
    onFetch(o: { faces: PotofForFace[]; stories: Story[] }) {
      oldlogs_stories.add(o.stories)
      oldlogs_faces.add(o.faces)
      console.log(o, oldlogs_stories.data, oldlogs_faces.data)
    }
  }
}

export function oldlog(story_id: STORY_ID) {
  return {
    version: '1.0.0',
    timer: '1y',
    idx: `${oldlog_url}sow/${story_id}.json`,
    onFetch(o: { stories: [Story]; events: Event[]; messages: Message[]; potofs: Potof[] }) {
      oldlog_stories.add(o.stories)
      oldlog_events.add(o.events)
      oldlog_messages.add(o.messages)
      oldlog_potofs.add(o.potofs)
      console.log(o)
    }
  }
}
