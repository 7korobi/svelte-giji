import type { STORY_ID, Story, Event, Message, Potof, PotofForFace } from '../map-reduce'
import { MapReduce } from '$lib/map-reduce'
import site from '$lib/site'
import { stories, events, messages, potofs, default_stories_query } from '../model-client'
import { potof_for_faces } from '../map-reduce'

let oldlog_url = ''

site.url.subscribe(({ oldlog }) => {
  oldlog_url = oldlog
})

export const oldlogs_stories = MapReduce(stories)
export const finder_oldlogs_stories = oldlogs_stories.filter(
  (o, p: ReturnType<typeof default_stories_query>, regexp: RegExp) => {
    if (p.order !== 'vid' && !is_intersect(p.folder_id, [o.folder_id])) return false
    if (p.order !== 'write_at' && !is_intersect(p.monthry, [o.monthry])) return false
    if (p.order !== 'upd_range' && !is_intersect(p.upd_range, [o.upd_range])) return false
    if (p.order !== 'upd_at' && !is_intersect(p.upd_at, [o.upd_at])) return false
    if (p.order !== 'sow_auth_id' && !is_intersect(p.sow_auth_id, [o.sow_auth_id])) return false
    if (p.order !== 'marks' && !is_intersect(p.mark, o.mark_ids)) return false
    if (p.order !== 'size' && !is_intersect(p.size, [o.size])) return false
    if (p.order !== 'say_limit.label' && !is_intersect(p.say_limit, [o.say_limit_id])) return false
    if (p.order !== 'game.label' && !is_intersect(p.game, [o.game_id])) return false
    if (p.order !== 'options' && !is_intersect(p.option, o.option_ids)) return false
    if (p.order !== 'traps' && !is_intersect(p.trap, o.trap_ids)) return false
    if (p.order !== 'discards' && !is_intersect(p.discard, o.discard_ids)) return false
    if (p.order !== 'configs' && !is_intersect(p.config, o.config_ids)) return false
    return !regexp || regexp.test(o.name)
  }
)
export const reduce_oldlogs_stories = oldlogs_stories.filter(
  (o, p: ReturnType<typeof default_stories_query>, regexp: RegExp) => {
    if (!is_intersect(p.folder_id, [o.folder_id])) return false
    if (!is_intersect(p.monthry, [o.monthry])) return false
    if (!is_intersect(p.upd_range, [o.upd_range])) return false
    if (!is_intersect(p.upd_at, [o.upd_at])) return false
    if (!is_intersect(p.sow_auth_id, [o.sow_auth_id])) return false
    if (!is_intersect(p.mark, o.mark_ids)) return false
    if (!is_intersect(p.size, [o.size])) return false
    if (!is_intersect(p.say_limit, [o.say_limit_id])) return false
    if (!is_intersect(p.game, [o.game_id])) return false
    if (!is_intersect(p.option, o.option_ids)) return false
    if (!is_intersect(p.trap, o.trap_ids)) return false
    if (!is_intersect(p.discard, o.discard_ids)) return false
    if (!is_intersect(p.config, o.config_ids)) return false
    return !regexp || regexp.test(o.name)
  }
)

export const oldlogs_faces = MapReduce(potof_for_faces)

export const oldlog_stories = MapReduce(stories)
export const oldlog_events = MapReduce(events)
export const oldlog_messages = MapReduce(messages)
export const oldlog_messages_summary = {
  memo: oldlog_messages.filter((o) => 'M' === o.subid)(),
  full: oldlog_messages.filter((o) => 'SAI'.includes(o.subid))(),
  normal: oldlog_messages.filter((o) => true)(),
  solo: oldlog_messages.filter((o) => true)(),
  extra: oldlog_messages.filter((o) => true)(),
  rest: oldlog_messages.filter((o) => true)()
}

export const oldlog_potofs = MapReduce(potofs)

function is_intersect<T>(...args: T[][]) {
  if (args.length < 2) return true

  const [a, b] = args
  if (!a.length) return true
  if (!b.length) return false

  for (const ao of a) {
    for (const bo of b) {
      if (ao === bo) return is_intersect(...args.slice(1))
    }
  }
  return false
}

export function oldlogs() {
  return {
    version: '1.0.0',
    timer: '12h',
    shift: '1h10m',
    idx: `${oldlog_url}sow/index.json`,
    onFetch(o: { faces: PotofForFace[]; stories: Story[] }) {
      oldlogs_stories.add(o.stories)
      oldlogs_faces.add(o.faces)
      console.log(o)
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
