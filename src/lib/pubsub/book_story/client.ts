import type { DIC } from '$lib/map-reduce'
import type {
  BOOK_STORY_ID,
  BookStory,
  MobRole,
  Mark,
  Game,
  SayLimit,
  Role,
  Option,
  BOOK_FOLDER_IDX,
  GAME_ID,
  MARK_ID,
  OPTION_ID,
  ROLE_ID,
  SAY_LIMIT_ID,
  TRAP_ID
} from '../map-reduce'
import { dic } from '$lib/map-reduce'
import { model } from '$lib/db/socket.io-client'
import format from 'date-fns/format/index.js'
import locale from 'date-fns/locale/ja/index.js'
import { SayLimits, Roles, Folders, Options, Marks, Games, RoleTables } from '../map-reduce'

type CountBy = DIC<{ count: number }>
type Counts = { _id: string; count: number }[]

const by_id = <T>(o: { _id: T }) => o._id
const by_this = (o: any) => o
const by_count = (o: { count: number }) => o.count
const by_write_at = (o: { write_at: Date | number }) => o.write_at

function digit(n: number, size = 2) {
  return n.toString().padStart(size, '0')
}

function emit(o: { count: number }) {
  o.count ||= 0
  o.count++
}
function emit_count<T extends { _id: string }>(dic: DIC<T & { count: number }>, item: T) {
  if (!item) return
  const o = (dic[item._id] ||= { ...item, count: 0 })
  o.count++
}
function emit_sum<T extends { _id: string; count: number }>(
  dic: DIC<T & { count: number }>,
  item: T
) {
  if (!item) return
  const o = (dic[item._id] ||= { ...item, count: 0 })
  o.count += item.count
}

export function default_story_query() {
  return {
    search: '',
    idx: '',
    mode: 'full',
    hide: []
  }
}

export function default_stories_query() {
  return {
    search: '',
    order: 'write_at',
    folder_id: [] as BOOK_FOLDER_IDX[],
    monthry: [] as string[],
    upd_range: [] as string[],
    upd_at: [] as string[],
    sow_auth_id: [] as string[],
    mark: [] as MARK_ID[],
    size: [] as string[],
    say_limit: [] as SAY_LIMIT_ID[],
    game: [] as GAME_ID[],
    option: [] as OPTION_ID[],
    trap: [] as TRAP_ID[],
    discard: [] as ROLE_ID[],
    config: [] as ROLE_ID[]
  }
}

export const stories = model({
  qid: (ids: BOOK_STORY_ID[]) => ids.toString(),
  format: () => ({
    list: [] as BookStory[],
    oldlog: {} as DIC<BookStory[]>,
    base: {
      in_month: {} as CountBy,
      yeary: {} as CountBy,
      monthry: {} as CountBy,
      folder_id: {} as CountBy,
      upd_range: {} as CountBy,
      upd_at: {} as CountBy,
      sow_auth_id: {} as CountBy,
      mark: {} as DIC<{ count: number }>,
      size: {} as CountBy,
      say_limit: {} as DIC<{ count: number } & SayLimit>,
      game: {} as DIC<{ count: number } & Game>,
      option: {} as DIC<{ count: number } & Option>,
      mob_role: {} as DIC<{ count: number } & MobRole>,
      trap: {} as DIC<{ count: number } & Role>,
      config: {} as DIC<{ count: number } & Role>,
      discard: {} as DIC<{ count: number } & Role>
    },
    group: {
      in_month: [] as Counts,
      yeary: [] as Counts,
      monthry: [] as Counts,
      folder_id: [] as Counts,
      upd_range: [] as Counts,
      upd_at: [] as { _id: string; count: number; at?: number }[],
      sow_auth_id: [] as Counts,
      mark: [] as ({ count: number } & Mark)[],
      size: [] as Counts,
      say_limit: {} as ({ count: number } & SayLimit)[],
      game: [] as ({ count: number } & Game)[],
      option: [] as ({ count: number } & Option)[],
      mob_role: [] as ({ count: number } & MobRole)[],
      trap: [] as ({ count: number } & Role)[],
      config: [] as ({ count: number } & Role)[],
      discard: [] as ({ count: number } & Role)[]
    }
  }),
  initialize: (doc) => {
    const write_at = new Date(doc.timer.updateddt)
    doc.in_month = format(write_at, 'MM月', { locale })
    doc.yeary = format(write_at, 'yyyy年', { locale })
    doc.monthry = doc.yeary + doc.in_month

    if ((doc.folder as any)?.toLowerCase) {
      doc.folder_id = (doc.folder as any).toLowerCase()
      doc.folder = Folders.find(doc.folder_id)
    }

    doc.game_id = doc.type.game
    doc.game = Games.find(doc.game_id)

    doc.role_table = RoleTables.find(doc.type.roletable)

    doc.mob_role = Roles.find(doc.type.mob) as MobRole

    doc.say_limit_id = doc.type.say
    doc.say_limit = SayLimits.find(doc.say_limit_id)

    doc.trap_ids = doc.card.event
    doc.discard_ids = doc.card.discard
    doc.traps = Roles.reduce(doc.trap_ids, emit).desc(by_count)
    doc.discards = Roles.reduce(doc.discard_ids, emit).desc(by_count)

    doc.config_ids = doc.card.config
    if (doc.role_table._id !== 'custom') {
      const table_role_ids = doc.role_table.role_ids_list[doc.vpl[0]] || []
      doc.config_ids = [...doc.config_ids.filter((o) => 'mob' === o), ...table_role_ids]
    }
    doc.configs = Roles.reduce(doc.config_ids, emit).desc(by_count)

    doc.option_ids = doc.options as any
    doc.options = doc.option_ids.map(Options.find).filter(by_this)

    doc.mark_ids = (() => {
      switch (doc.rating as any) {
        case null:
        case '0':
        case 'default':
          return []
        case 'gro':
          return ['violence']
        case 'sexyviolence':
          return ['sexy', 'violence']
        case 'sexylove':
          return ['sexy', 'love']
        case 'child':
        case 'fireplace':
          return ['catwalk']
        case 'R15':
        case 'r15':
        case 'r18':
          return ['alert']
        default:
          return [doc.rating]
      }
    })()

    doc.upd_range = `${doc.upd.interval * 24}h`
    doc.upd_at = `${digit(doc.upd.hour)}:${digit(doc.upd.minute)}`
    doc.size = `x${doc.vpl[0]}`
    doc.write_at = write_at
  },
  reduce: (data, doc) => {
    dic(data.oldlog, doc.folder_id, []).push(doc)
    emit(dic(data.base.in_month, doc.in_month, {}))
    emit(dic(data.base.yeary, doc.yeary, {}))
    emit(dic(data.base.monthry, doc.monthry, {}))
    emit(dic(data.base.folder_id, doc.folder_id, {}))
    emit(dic(data.base.upd_range, doc.upd_range, {}))
    emit(dic(data.base.upd_at, doc.upd_at, {}))
    emit(dic(data.base.size, doc.size, {}))
    emit(dic(data.base.sow_auth_id, doc.sow_auth_id, {}))
    for (const mark_id of doc.mark_ids) {
      dic(data.base.mark, mark_id, { count: 0 }).count++
    }
    emit_count(data.base.say_limit, doc.say_limit)
    emit_count(data.base.game, doc.game)
    for (const opt of doc.options) {
      emit_count(data.base.option, opt)
    }

    emit_count(data.base.mob_role, doc.mob_role)
    for (const o of doc.traps) {
      emit_sum(data.base.trap, o)
    }
    for (const o of doc.configs) {
      emit_sum(data.base.config, o)
    }
    for (const o of doc.discards) {
      emit_sum(data.base.discard, o)
    }
  },
  order: (data, { sort }, order: ReturnType<typeof default_stories_query>) => {
    sort(data.list).desc(by_write_at)
    for (const key in data.oldlog) {
      const list = data.oldlog[key]
      sort(list).desc(by_write_at)
    }
    data.group.yeary = sort(data.base.yeary).desc(by_id)
    data.group.monthry = sort(data.base.monthry).asc(by_id)
    data.group.in_month = sort(data.base.in_month).asc(by_id)
    data.group.upd_at = sort(data.base.upd_at).asc(by_id)
    for (const upd_at of data.group.upd_at) {
      upd_at.at = Math.floor(Number(upd_at._id.slice(0, 2)) / 4)
    }

    data.group.size = sort(data.base.size).asc(({ _id }) => Number(_id.slice(1)))

    data.group.folder_id = sort(data.base.folder_id).desc(by_count)
    data.group.upd_range = sort(data.base.upd_range).desc(by_count)
    data.group.sow_auth_id = sort(data.base.sow_auth_id).desc(by_count)
    data.group.mark = sort(data.base.mark).desc(by_count)
    data.group.say_limit = sort(data.base.say_limit).desc(by_count)
    data.group.game = sort(data.base.game).desc(by_count)
    data.group.option = sort(data.base.option).desc(by_count)
    data.group.mob_role = sort(data.base.mob_role).desc(by_count)
    data.group.trap = sort(data.base.trap).desc(by_count)
    data.group.config = sort(data.base.config).desc(by_count)
    data.group.discard = sort(data.base.discard).desc(by_count)
  }
})

export const story_summary = model({
  qid: (is_old: boolean) => is_old.toString(),
  format: () => ({
    list: [] as BookStory[],
    folder: {} as DIC<{ list: BookStory[] }>
  }),
  reduce(data, doc) {
    doc.folder_id = (doc.folder as any).toLowerCase()
    doc.folder = Folders.find(doc.folder_id)
    dic(data.folder, doc.folder_id, {}, 'list', []).push(doc)
  },
  order(data, { sort }) {
    sort(data.list).desc((o) => o.timer.nextcommitdt)
  }
})
