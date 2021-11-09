import type { STORY_ID, Story, Event, Message, Potof, PotofForFace } from '../map-reduce'
import { MapReduce } from '$lib/map-reduce'
import site from '$lib/site'
import { stories, events, messages, potofs } from '../model-client'

let api_url = ''

site.url.subscribe(({ api }) => {
  api_url = api
})

export const oldlogs_stories = MapReduce(stories)

export const oldlog_stories = MapReduce(stories)
export const oldlog_events = MapReduce(events)
export const oldlog_messages = MapReduce(messages)
export const oldlog_potofs = MapReduce(potofs)

export function oldlogs() {
  return {
    version: '1.0.0',
    timer: '12h',
    shift: '1h10m',
    idx: `${api_url}story/oldlog`,
    onFetch(o: { faces: PotofForFace; stories: Story[] }) {
      oldlogs_stories.add(o.stories)
      console.log(o)
    }
  }
}

export function oldlog(story_id: STORY_ID) {
  return {
    version: '1.0.0',
    timer: '1y',
    idx: `${api_url}story/oldlog/${story_id}`,
    onFetch(o: { stories: [Story]; events: Event[]; messages: Message[]; potofs: Potof[] }) {
      oldlog_stories.add(o.stories)
      oldlog_events.add(o.events)
      oldlog_messages.add(o.messages)
      oldlog_potofs.add(o.potofs)
      console.log(o)
    }
  }
}
