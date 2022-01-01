import type {
  BOOK_STORY_ID,
  BookStory,
  BookEvent,
  BookMessage,
  BookPotof,
  PotofForFace,
  BOOK_POTOF_ID,
  CHR_SET_IDX,
  BOOK_PHASE_IDX,
  BOOK_MESSAGE_ID,
  BOOK_EVENT_IDX,
  BOOK_EVENT_ID,
  HANDLE,
  BOOK_PHASE_IDX_BARE,
  BookCardSelect,
  BookCardLive,
  BookCardRole
} from '../map-reduce'
import { Phases } from '../map-reduce'
import { MapReduce } from '$lib/map-reduce'
import { url } from '$lib/site/store'
import { Faces, Roles, ChrJobs } from '../map-reduce'
import {
  stories,
  events,
  messages,
  default_stories_query,
  potofs,
  cards,
  stats
} from '../model-client'
import { potof_for_faces } from '../map-reduce'

let oldlog_url = ''

url.subscribe(({ oldlog }) => {
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
export const memo_oldlog_messages = oldlog_messages.filter(
  (o, regexp: RegExp) => 'M' === o.group && (!regexp || regexp.test(o.log))
)
export const full_oldlog_messages = oldlog_messages.filter(
  (o, regexp: RegExp) => 'SAI'.includes(o.group) && (!regexp || regexp.test(o.log))
)
export const normal_oldlog_messages = oldlog_messages.filter(
  (o, regexp: RegExp) =>
    'SAI'.includes(o.group) && normal_handles.includes(o.handle) && (!regexp || regexp.test(o.log))
)
export const solo_oldlog_messages = oldlog_messages.filter(
  (o, regexp: RegExp) =>
    'SAI'.includes(o.group) && solo_handles.includes(o.handle) && (!regexp || regexp.test(o.log))
)
export const rest_oldlog_messages = oldlog_messages.filter(
  (o, regexp: RegExp) =>
    'SAI'.includes(o.group) && rest_handles.includes(o.handle) && (!regexp || regexp.test(o.log))
)
export const extra_oldlog_messages = oldlog_messages.filter(
  (o, regexp: RegExp) =>
    'SAI'.includes(o.group) && !extra_handles.includes(o.handle) && (!regexp || regexp.test(o.log))
)

export const oldlog_potofs = MapReduce(potofs)
export const oldlog_cards = MapReduce(cards)
export const oldlog_stats = MapReduce(stats)

const normal_handles = ['SSAY', 'VSSAY', 'TITLE', 'MAKER', 'ADMIN', 'public']
const solo_handles = ['TSAY', 'private']
const rest_handles = ['GSAY', 'VGSAY']
const extra_handles = [
  'SSAY',
  'VSSAY',
  'GSAY',
  'VGSAY',
  'TSAY',
  'TITLE',
  'MAKER',
  'ADMIN',
  'public'
]

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
    onFetch(o: { faces: PotofForFace[]; stories: BookStory[] }) {
      oldlogs_stories.add(o.stories)
      oldlogs_faces.add(o.faces)
      console.log(o)
    }
  }
}

export function oldlog(story_id: BOOK_STORY_ID) {
  if (!story_id) return {}
  return {
    version: '1.0.0',
    timer: '1y',
    idx: `${oldlog_url}sow/${story_id}.json`,
    onFetch(o: {
      stories: [BookStory]
      events: BookEvent[]
      messages: BookMessage[]
      potofs: BookPotof[]
    }) {
      oldlog_stories.clear()
      oldlog_events.clear()
      oldlog_messages.clear()
      oldlog_potofs.clear()
      oldlog_cards.clear()
      oldlog_stats.clear()

      const story = o.stories[0]

      const potof_by: { [key: `${string}-${CHR_SET_IDX}`]: BookPotof } = {}
      o.potofs.forEach((o, potof_idx) => {
        const potof_id: BOOK_POTOF_ID = `${story_id}-${potof_idx}`
        o._id = potof_id
        o.cards = [] as any

        if (Roles.find(o.select)) {
          oldlog_cards.add([
            { _id: `${potof_id}-select`, story_id, story, potof: o, role_id: o.select, act: {} }
          ])
          delete o.select
          o.cards[0] = oldlog_cards.find(`${potof_id}-select`) as BookCardSelect
        }

        if (o.role) {
          if (Roles.find(o.live)) {
            const date = 0 <= o.deathday ? o.deathday : undefined
            if (o.role[0] && o.live !== 'mob') {
              oldlog_cards.add([
                {
                  _id: `${potof_id}-live`,
                  story_id,
                  story,
                  potof: o,
                  role_id: o.live,
                  date,
                  act: {}
                }
              ])
            } else {
              oldlog_cards.add([
                {
                  _id: `${potof_id}-live`,
                  story_id,
                  story,
                  potof: o,
                  role_id: 'leave',
                  date: 0,
                  act: {}
                }
              ])
            }
            delete o.live
            delete o.deathday
            o.cards[1] = oldlog_cards.find(`${potof_id}-live`) as BookCardLive
          }

          if (Roles.find(o.role[0])) {
            oldlog_cards.add([
              { _id: `${potof_id}-role`, story_id, story, potof: o, role_id: o.role[0], act: {} }
            ])
            o.cards[2] = oldlog_cards.find(`${potof_id}-role`) as BookCardRole
          }
          if (Roles.find(o.role[1])) {
            oldlog_cards.add([
              { _id: `${potof_id}-gift`, story_id, story, potof: o, role_id: o.role[1], act: {} }
            ])
            o.cards[3] = oldlog_cards.find(`${potof_id}-gift`) as BookCardRole
          }
          delete o.role
        }
        if (o.cards[1].act.incite) o.cards[1].act.incite.remain = o.point.actaddpt
        delete o.point.actaddpt
        delete o.say

        if (o.live === 'live') {
          o.cards[1].act.commit.done = o.commit
          delete o.commit
        }

        o.job = o.zapcount
          ? ['IR', 'R', 'O', 'Y', 'G', 'B', 'I', 'V', 'UV'][o.clearance] + '-'
          : ChrJobs.find(`${o.csid}_${o.face_id}`)?.job
        potof_by[`${o.sow_auth_id}`] = o
      })
      oldlog_potofs.add(o.potofs)

      o.events.forEach((o) => {
        o.story_id = story_id
        o.story = story
        o.name ||= `${o.turn}日目`
        o.write_at = new Date(o.updated_at)
      })
      oldlog_events.add(o.events)

      o.messages = o.messages.filter((o) => o.mestype !== 'DELETED')
      o.messages.forEach((o) => {
        let phase_idx = o.logid.slice(0, 2) as BOOK_PHASE_IDX
        if ((phase_idx as string) === '-S') phase_idx = 'iI'
        const message_idx = `${Number(o.logid.slice(2))}` as `${number}`

        o.event_id ||= o._id.split('-').slice(0, 3).join('-') as BOOK_EVENT_ID

        switch (o.subid) {
          case 'M':
            o.group = 'M'
            o.show = 'report'
            break
          case 'S':
            o.group = 'S'
            o.show = phase_idx === 'II' ? 'post' : 'talk'
            break
          case 'I':
            o.group = 'I'
            o.show = o.log?.match(/。|、/g)?.length > 3 ? 'report' : 'post'
            delete o.name
            // delete o.face_id
            break
          case 'A':
          case 'B':
            o.group = 'A'
            o.show = 'post'
            o.log = `${o.name}は、${o.log}`
            delete o.name
            // delete o.face_id
            break
          default:
            console.log(o.subid)
            break
        }

        switch (o.mestype) {
          case 'MAKER':
            o.handle = 'MAKER'
            if (o.show === 'talk') o.show = 'report'
            break
          case 'ADMIN':
            o.handle = 'ADMIN'
            if (o.show === 'talk') o.show = 'report'
            break
          case 'INFONOM':
            o.handle = 'public'
            break
          case 'INFOSP':
            o.handle = 'private'
            break
          case 'INFOWOLF':
            o.handle = 'WSAY'
            break
          case 'VSAY':
            o.handle = 'VSSAY'
            break
          case 'BSAY':
            o.handle = 'XSAY'
            break
          case 'SPSAY':
            o.handle = 'PSAY'
            break
          case 'SAY':
            o.handle = 'SSAY'
            break
          default:
            o.handle = o.mestype as HANDLE
            break
        }
        delete o.logid
        delete o.mestype

        o.write_at = new Date(o.date)
        delete o.date

        if (o.face_id) {
          o.potof = potof_by[`${o.sow_auth_id}`]
          o.potof_id = o.potof?._id as BOOK_POTOF_ID
        }

        if (o.log) {
          logscan(o)
        } else {
          o.log = 'メモをはがした。'
          o.show = 'post'
        }
        if (o.to) {
          phase_idx = 'AIM'
          o.handle = 'AIM'
        }
        o._id = `${o.event_id}-${phase_idx}-${message_idx}`
        if (o.log === '*CAST*') {
          o._id = `${o.event_id}-mS-cast`
          o.handle = 'TITLE'
          o.show = 'cast'
        }

        if (['maker', 'admin', 'c06'].includes(o.face_id)) o.face_id = undefined
        if (o.name) {
          o.name = o.name.replace(/&#x([0-9A-F]+);/g, (str, code) =>
            String.fromCharCode(parseInt(code, 16))
          )
        }
        o.story_id = story_id
        o.story = story
        o.event = oldlog_events.find(o.event_id)
        o.face = Faces.find(o.face_id)
        o.deco = (o.style || '') as typeof o.deco
        delete o.style
      })
      oldlog_messages.add(o.messages)

      const event_head = o.events[0]
      const event_foot = o.events.slice(-1)[0]
      oldlog_events.add([
        {
          _id: `${story_id}-top`,
          name: `📖タイトル`,
          story_id,
          story,
          turn: -1,
          winner: event_foot.winner,
          write_at: new Date(event_head.write_at.getTime() - 1)
        }
      ])

      const message_head = o.messages[0]
      const [welcome, v_rules] = story.comment.split(/■村のルール<br>/)
      const event_id = `${story_id}-top` as BOOK_EVENT_ID
      const event = oldlog_events.find(event_id)
      const phase = Phases.find('mS')

      oldlog_messages.add([
        logscan({
          _id: `${story_id}-top-mS-title` as BOOK_MESSAGE_ID,
          story_id,
          story,
          event_id,
          event,
          phase,
          write_at: new Date(message_head.write_at.getTime() - 4),
          mention_ids: [],
          handle: 'TITLE',
          show: 'logo',
          deco: '',
          group: 'A',
          sow_auth_id: story.sow_auth_id,
          log: ''
        })
      ])

      if (welcome) {
        oldlog_messages.add([
          logscan({
            _id: `${story_id}-top-mS-welcome` as BOOK_MESSAGE_ID,
            story_id,
            story,
            event_id,
            event,
            phase,
            write_at: new Date(message_head.write_at.getTime() - 3),
            mention_ids: [],
            handle: 'TITLE',
            show: 'report',
            deco: 'head',
            group: 'A',
            sow_auth_id: story.sow_auth_id,
            log: welcome
          })
        ])
      }
      if (v_rules) {
        oldlog_messages.add([
          logscan({
            _id: `${story_id}-top-mS-vrule` as BOOK_MESSAGE_ID,
            story_id,
            story,
            event_id,
            event,
            phase,
            write_at: new Date(message_head.write_at.getTime() - 2),
            mention_ids: [],
            handle: 'TITLE',
            show: 'report',
            deco: '',
            group: 'A',
            sow_auth_id: story.sow_auth_id,
            log: `<h3>村のルール</h3>${v_rules}`
          })
        ])
      }

      const message_foot = o.messages.slice(-1)[0]

      oldlog_stories.add(o.stories)
      console.log('onFetch', o)
    }
  }
}

function logscan(o: BookMessage) {
  const ida = o._id.split('-')
  const story_id = `${ida[0]}-${ida[1]}`
  const phase_idx = ida[3]

  o.mention_ids = []
  o.log = o.log.replace(
    /<mw\ +(..)(\d+),(\d+),(.+?)>/g,
    (
      str: string,
      _phase_idx: BOOK_PHASE_IDX_BARE,
      $1: string,
      _event_idx: BOOK_EVENT_IDX,
      _code: string
    ) => {
      const _idx = Number($1)
      const _mention_id = [story_id, _event_idx, _phase_idx, _idx].join('-') as BOOK_MESSAGE_ID
      if (_phase_idx === 'MM') {
        _phase_idx = `${phase_idx[0]}M` as BOOK_PHASE_IDX
      }
      o.mention_ids.push(_mention_id)
      return `<q class="cite-bottom" cite="${_mention_id}"><b>&gt;&gt;</b>${_code}</q>`
    }
  )
  return o
}
