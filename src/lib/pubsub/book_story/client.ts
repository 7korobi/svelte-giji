import type { ARY, DIC } from '$lib/map-reduce'
import type { Story } from '../map-reduce'
import { dic } from '$lib/map-reduce'
import { model } from '$lib/db/socket.io-client'
import format from 'date-fns/format/index.js'
import locale from 'date-fns/locale/ja/index.js'

export const stories = model({
  qid: (ids) => ids.toString,
  format: () => ({
    list: [] as Story[],
    oldlog: {} as DIC<Story[]>,
    base: {
      in_month: {} as DIC<{ count: number }>,
      yeary: {} as DIC<{ count: number }>,
      monthry: {} as DIC<{ count: number }>,
      folder_id: {} as DIC<{ count: number }>,
      upd_range: {} as DIC<{ count: number }>,
      upd_at: {} as DIC<{ count: number }>,
      sow_auth_id: {} as DIC<{ count: number }>,
      rating: {} as DIC<{ count: number }>,
      size: {} as DIC<{ count: number }>,
      say: {} as DIC<{ count: number }>,
      game: {} as DIC<{ count: number }>,
      mob: {} as DIC<{ count: number }>,
      option: {} as DIC<{ count: number }>,
      event: {} as DIC<{ count: number }>,
      discard: {} as DIC<{ count: number }>,
      config: {} as DIC<{ count: number }>
    },
    group: {
      in_month: [] as { _id: string; count: number }[],
      yeary: [] as { _id: string; count: number }[],
      monthry: [] as { _id: string; count: number }[],
      folder_id: [] as { _id: string; count: number }[],
      upd_range: [] as { _id: string; count: number }[],
      upd_at: [] as { _id: string; count: number }[],
      sow_auth_id: [] as { _id: string; count: number }[],
      rating: [] as { _id: string; count: number }[],
      size: [] as { _id: string; count: number }[],
      say: [] as { _id: string; count: number }[],
      game: [] as { _id: string; count: number }[],
      mob: [] as { _id: string; count: number }[],
      option: [] as { _id: string; count: number }[],
      event: [] as { _id: string; count: number }[],
      discard: [] as { _id: string; count: number }[],
      config: [] as { _id: string; count: number }[]
    }
  }),
  reduce: (data, doc) => {
    const updated_at = new Date(doc.timer.updateddt)
    const in_month = format(updated_at, 'MM月', { locale })
    const yeary = format(updated_at, 'yyyy年', { locale })
    const monthry = yeary + in_month
    const folder_id = doc.folder.toLowerCase()
    const upd_range = `${doc.upd.interval * 24}h`
    const upd_at = `${digit(doc.upd.hour)}:${digit(doc.upd.minute)}`
    const size = `x${doc.vpl[0]}`
    let rating: string = doc.rating
    if ([null, 0, '0', 'null', 'view'].includes(doc.rating)) rating = 'default'
    if (['R15', 'r15', 'r18'].includes(doc.rating)) rating = 'alert'
    if (['gro'].includes(doc.rating)) rating = 'violence'

    doc.write_at = updated_at.getTime()

    dic(data.oldlog, doc.folder.toLowerCase(), []).push(doc)
    dic(data.oldlog, 'all', []).push(doc)
    emit(dic(data.base.in_month, in_month, {}))
    emit(dic(data.base.yeary, yeary, {}))
    emit(dic(data.base.monthry, monthry, {}))
    emit(dic(data.base.folder_id, folder_id, {}))
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
  reduce: (data, doc) => {
    dic(data.folder, doc.folder.toLowerCase(), {}, 'list', []).push(doc)
  },
  order: (data, { sort }) => {
    sort(data.list).desc((o) => o.timer.nextcommitdt)
  }
})
