import type { DIC } from '$lib/map-reduce'
import type { STORY_ID, Story, EVENT_ID } from '../map-reduce'
import { dic } from '$lib/map-reduce'
import { model } from '$lib/db/socket.io-client'
import format from 'date-fns/format/index.js'
import locale from 'date-fns/locale/ja/index.js'
import { Folders } from '../map-reduce'
import { events } from '../model-client'

type CountBy = DIC<{ count: number }>
type Counts = { _id: string; count: number }[]

export const stories = model({
  qid: (ids: STORY_ID[]) => ids.toString(),
  format: () => ({
    list: [] as Story[],
    oldlog: {} as DIC<Story[]>,
    base: {
      in_month: {} as CountBy,
      yeary: {} as CountBy,
      monthry: {} as CountBy,
      folder_id: {} as CountBy,
      upd_range: {} as CountBy,
      upd_at: {} as CountBy,
      sow_auth_id: {} as CountBy,
      rating: {} as CountBy,
      size: {} as CountBy,
      say: {} as CountBy,
      game: {} as CountBy,
      mob: {} as CountBy,
      option: {} as CountBy,
      event: {} as CountBy,
      discard: {} as CountBy,
      config: {} as CountBy
    },
    group: {
      in_month: [] as Counts,
      yeary: [] as Counts,
      monthry: [] as Counts,
      folder_id: [] as Counts,
      upd_range: [] as Counts,
      upd_at: [] as Counts,
      sow_auth_id: [] as Counts,
      rating: [] as Counts,
      size: [] as Counts,
      say: [] as Counts,
      game: [] as Counts,
      mob: [] as Counts,
      option: [] as Counts,
      event: [] as Counts,
      discard: [] as Counts,
      config: [] as Counts
    }
  }),
  reduce: (data, doc) => {
    doc.folder_id = (doc.folder as any).toLowerCase()
    doc.folder = Folders.find(doc.folder_id)

    const updated_at = new Date(doc.timer.updateddt)
    const in_month = format(updated_at, 'MM月', { locale })
    const yeary = format(updated_at, 'yyyy年', { locale })
    const monthry = yeary + in_month
    const upd_range = `${doc.upd.interval * 24}h`
    const upd_at = `${digit(doc.upd.hour)}:${digit(doc.upd.minute)}`
    const size = `x${doc.vpl[0]}`
    let rating: string = doc.rating
    if ([null, 0, '0', 'null', 'view'].includes(doc.rating)) rating = 'default'
    if (['R15', 'r15', 'r18'].includes(doc.rating)) rating = 'alert'
    if (['gro'].includes(doc.rating)) rating = 'violence'

    doc.write_at = updated_at.getTime()

    dic(data.oldlog, doc.folder_id, []).push(doc)
    dic(data.oldlog, 'all', []).push(doc)
    emit(dic(data.base.in_month, in_month, {}))
    emit(dic(data.base.yeary, yeary, {}))
    emit(dic(data.base.monthry, monthry, {}))
    emit(dic(data.base.folder_id, doc.folder_id, {}))
    emit(dic(data.base.folder_id, 'all', {}))
    emit(dic(data.base.upd_range, upd_range, {}))
    emit(dic(data.base.upd_at, upd_at, {}))
    emit(dic(data.base.size, size, {}))
    emit(dic(data.base.sow_auth_id, doc.sow_auth_id, {}))
    emit(dic(data.base.rating, rating, {}))
    emit(dic(data.base.say, doc.type.say, {}))
    emit(dic(data.base.mob, doc.type.mob, {}))
    emit(dic(data.base.game, doc.type.game, {}))
    for (const opt_id of doc.options) {
      emit(dic(data.base.option, opt_id, {}))
    }
    for (const card_id of doc.card.event) {
      emit(dic(data.base.event, card_id, {}))
    }
    for (const card_id of doc.card.discard) {
      emit(dic(data.base.discard, card_id, {}))
    }
    for (const card_id of doc.card.config) {
      emit(dic(data.base.config, card_id, {}))
    }

    function digit(n: number, size = 2) {
      return n.toString().padStart(size, '0')
    }

    function emit(o: { count: number }) {
      o.count ||= 0
      o.count++
    }
  },
  order: (data, { sort }) => {
    sort(data.list).desc((o) => o.write_at)
    for (const key in data.oldlog) {
      const list = data.oldlog[key]
      sort(list).desc((o) => o.write_at)
    }
    data.group.yeary = sort(data.base.yeary).desc((o) => o._id)
    data.group.monthry = sort(data.base.monthry).asc((o) => o._id)
    data.group.in_month = sort(data.base.in_month).asc((o) => o._id)
    data.group.upd_at = sort(data.base.upd_at).asc((o) => o._id)

    data.group.folder_id = sort(data.base.folder_id).desc((o) => o.count)
    data.group.upd_range = sort(data.base.upd_range).desc((o) => o.count)
    data.group.sow_auth_id = sort(data.base.sow_auth_id).desc((o) => o.count)
    data.group.rating = sort(data.base.rating).desc((o) => o.count)
    data.group.size = sort(data.base.size).desc((o) => o.count)
    data.group.say = sort(data.base.say).desc((o) => o.count)
    data.group.mob = sort(data.base.mob).desc((o) => o.count)
    data.group.game = sort(data.base.game).desc((o) => o.count)
    data.group.option = sort(data.base.option).desc((o) => o.count)
    data.group.event = sort(data.base.event).desc((o) => o.count)
    data.group.discard = sort(data.base.discard).desc((o) => o.count)
    data.group.config = sort(data.base.config).desc((o) => o.count)
  }
})

export const story_summary = model({
  qid: (is_old: boolean) => is_old.toString(),
  format: () => ({
    list: [] as Story[],
    folder: {} as DIC<{ list: Story[] }>
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
