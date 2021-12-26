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
  BOOK_MESSAGE_IDX,
  CHAT,
  BOOK_MESSAGE_ID,
  BOOK_EVENT_IDX,
  BOOK_EVENT_ID,
  HANDLE
} from '../map-reduce'
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
export const memo_oldlog_messages = oldlog_messages.filter((o) => 'M' === o.group)
export const full_oldlog_messages = oldlog_messages.filter((o) => 'SAI'.includes(o.group))
export const normal_oldlog_messages = oldlog_messages.filter(
  (o) =>
    'SAI'.includes(o.group) &&
    ['SSAY', 'VSSAY', 'TITLE', 'MAKER', 'ADMIN', 'public'].includes(o.handle)
)
export const solo_oldlog_messages = oldlog_messages.filter(
  (o) => 'SAI'.includes(o.group) && ['TSAY', 'private'].includes(o.handle)
)
export const rest_oldlog_messages = oldlog_messages.filter(
  (o) => 'SAI'.includes(o.group) && ['GSAY', 'VGSAY'].includes(o.handle)
)
export const extra_oldlog_messages = oldlog_messages.filter(
  (o) =>
    'SAI'.includes(o.group) &&
    !['SSAY', 'VSSAY', 'GSAY', 'VGSAY', 'TSAY', 'TITLE', 'MAKER', 'ADMIN', 'public'].includes(
      o.handle
    )
)

export const oldlog_potofs = MapReduce(potofs)
export const oldlog_cards = MapReduce(cards)
export const oldlog_stats = MapReduce(stats)

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
      console.log('onFetch', o)
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

        oldlog_stats.add([{ _id: o.event_id, story_id, story }])

        if (Roles.find(o.select)) {
          oldlog_cards.add([{ _id: `${potof_id}-request`, story_id, story, role_id: o.select }])
          delete o.select
        }

        if (o.role) {
          if (Roles.find(o.live)) {
            const date = 0 <= o.deathday ? o.deathday : undefined
            if (o.role[0] && o.live !== 'mob') {
              oldlog_cards.add([
                { _id: `${potof_id}-live`, story_id, story, role_id: o.live, date }
              ])
            } else {
              oldlog_cards.add([
                { _id: `${potof_id}-live`, story_id, story, role_id: 'leave', date: 0 }
              ])
            }
            delete o.live
            delete o.deathday
          }

          if (Roles.find(o.role[0])) {
            oldlog_cards.add([{ _id: `${potof_id}-role`, story_id, story, role_id: o.role[0] }])
          }
          if (Roles.find(o.role[1])) {
            oldlog_cards.add([{ _id: `${potof_id}-gift`, story_id, story, role_id: o.role[1] }])
          }
          delete o.role
        }

        oldlog_stats.add([{ _id: `${potof_id}-give`, story_id, story, give: o.point.actaddpt }])
        delete o.point.actaddpt

        if (o.live === 'live') {
          oldlog_stats.add([{ _id: `${potof_id}-commit`, story_id, story, sw: !!o.commit }])
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
      })
      oldlog_events.add(o.events)

      o.messages.forEach((o) => {
        let phase_idx = o.logid.slice(0, 2) as BOOK_PHASE_IDX
        if ((phase_idx as string) === '-S') phase_idx = 'iI'
        const message_idx = `${Number(o.logid.slice(2))}` as BOOK_MESSAGE_IDX

        o.event_id ||= o._id.split('-').slice(0, 3).join('-') as BOOK_EVENT_ID
        o._id = `${o.event_id}-${phase_idx}-${message_idx}`

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
            // delete o.face_id
            o.group = 'I'
            o.show = o.log?.match(/。|、/g)?.length > 3 ? 'report' : 'post'
            break
          case 'A':
          case 'B':
            // delete o.face_id
            o.group = 'A'
            o.show = 'post'
            o.log = `${o.name}は、${o.log}`
            break
          default:
            console.log(o.subid)
            break
        }

        switch (o.mestype) {
          case 'DELETED':
            return
          case 'MAKER':
          case 'ADMIN':
            // delete o.face_id
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
        delete o.sow_auth_id

        if (o.log === '*CAST*') {
          o._id = `${o.event_id}-mS-CAST`
          o.handle = 'TITLE'
          o.show = 'report'
        }

        o.mention_ids = []
        if (o.log) {
          o.log = o.log.replace(
            /<mw\ +(..)(\d+),(\d+),(.+?)>/g,
            (
              str: string,
              _phase_idx: BOOK_PHASE_IDX,
              $1: string,
              _event_idx: BOOK_EVENT_IDX,
              _code: string
            ) => {
              const _idx = Number($1)
              const _mention_id = [story_id, _event_idx, _phase_idx, _idx].join(
                '-'
              ) as BOOK_MESSAGE_ID
              if (_phase_idx === 'MM') {
                _phase_idx = `${phase_idx[0]}M` as BOOK_PHASE_IDX
              }
              o.mention_ids.push(_mention_id)
              return `<q class="cite-bottom" cite="${_mention_id}"><b>&gt;&gt;</b>${_code}</q>`
            }
          )
        } else {
          o.log = 'メモをはがした。'
          o.show = 'post'
        }
        if (o.to) {
          phase_idx = 'AIM'
          o.handle = 'AIM'
        }

        if (['maker', 'admin', 'c06'].includes(o.face_id)) o.face_id = undefined
        o.name = o.name.replace(/&#x([0-9A-F]+);/g, (str, code) =>
          String.fromCharCode(parseInt(code, 16))
        )
        o.story_id = story_id
        o.story = story
        o.event = oldlog_events.find(o.event_id)
        o.face = Faces.find(o.face_id)
        o.deco = `text ${o.style}` as typeof o.deco
        delete o.style
      })
      oldlog_messages.add(o.messages)

      oldlog_events.add([
        {
          _id: `${story_id}-top`,
          name: `📖タイトル`,
          story_id,
          story,
          turn: -1,
          winner: oldlog_events.data.list.slice(-1)[0].winner,
          write_at: new Date(oldlog_events.data.list[0].write_at.getDate() - 1)
        }
      ])

      const message_head = oldlog_messages.data.list[0]
      const [welcome, v_rules] = story.comment.split(/■村のルール<br>/)
      const event_id = `${story_id}-top` as BOOK_EVENT_ID
      const event = oldlog_events.find(event_id)

      oldlog_messages.add([
        {
          _id: `${story_id}-top-mS-title` as BOOK_MESSAGE_ID,
          story_id,
          story,
          event_id,
          event,
          write_at: new Date(message_head.write_at.getDate() - 4),
          mention_ids: [],
          handle: 'TITLE',
          show: 'report',
          deco: 'text logo',
          group: 'A',
          sow_auth_id: story.sow_auth_id,
          log: ''
        }
      ])

      if (welcome) {
        oldlog_messages.add([
          {
            _id: `${story_id}-top-mS-welcome` as BOOK_MESSAGE_ID,
            story_id,
            story,
            event_id,
            event,
            write_at: new Date(message_head.write_at.getDate() - 3),
            mention_ids: [],
            handle: 'TITLE',
            show: 'report',
            deco: 'text head',
            group: 'A',
            sow_auth_id: story.sow_auth_id,
            log: welcome
          }
        ])
      }
      if (v_rules) {
        oldlog_messages.add([
          {
            _id: `${story_id}-top-mS-vrule` as BOOK_MESSAGE_ID,
            story_id,
            story,
            event_id,
            event,
            write_at: new Date(message_head.write_at.getDate() - 2),
            mention_ids: [],
            handle: 'TITLE',
            show: 'report',
            deco: 'text',
            group: 'A',
            sow_auth_id: story.sow_auth_id,
            log: `<h3>村のルール</h3>${v_rules}`
          }
        ])
      }

      const message_foot = oldlog_messages.data.list.slice(-1)[0]

      oldlog_stories.add(o.stories)
    }
  }
}
