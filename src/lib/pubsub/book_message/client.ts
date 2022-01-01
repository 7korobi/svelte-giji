import type { DIC } from '$lib/map-reduce'
import type {
  BookMessage,
  BOOK_EVENT_IDX,
  BOOK_FOLDER_IDX,
  BOOK_STORY_ID,
  BOOK_STORY_IDX
} from '../map-reduce'
import type { BOOK_MESSAGE_IDX, BOOK_PHASE_IDX } from './map-reduce'
import { model } from '$lib/db/socket.io-client'
import { dic } from '$lib/map-reduce'
import { Phases } from './map-reduce'

type EMIT = {
  max: Date
  max_is: BookMessage
  min: Date
  min_is: BookMessage
  count: number
  all: number
}

export const messages = model({
  qid: (ids: BOOK_STORY_ID[]) => ids.toString(),
  format: () => ({
    list: [] as BookMessage[],
    event: {} as DIC<BookMessage[]>,
    index: {} as DIC<{ max: number; max_is: BookMessage }>,
    last: {} as DIC<{ max: Date; max_is: BookMessage }>,
    say: { count: 0, all: 0 } as EMIT,
    potof: {} as DIC<DIC<EMIT>>,
    side: {} as DIC<DIC<{ max: Date; max_is: BookMessage }>>,
    mention: {} as DIC<{ count: number }>,
    mention_to: {} as DIC<DIC<{ count: number }>>
  }),
  initialize(doc) {
    const id_ary = doc._id.split('-')
    doc.phase = Phases.find(id_ary[3] as BOOK_PHASE_IDX)
  },
  reduce(data, doc) {
    const id_ary = doc._id.split('-') as [
      BOOK_FOLDER_IDX,
      BOOK_STORY_IDX,
      BOOK_EVENT_IDX,
      BOOK_PHASE_IDX,
      BOOK_MESSAGE_IDX
    ]
    const [, , , phase_idx, message_idx] = id_ary
    const all_phase_id = `${id_ary[0]}-${id_ary[1]}-top-${id_ary[3]}`
    const phase_id = `${id_ary[0]}-${id_ary[1]}-${id_ary[2]}-${id_ary[3]}`

    dic(data.event, doc.event_id, []).push(doc)
    max(dic(data.index, phase_idx, {}), parseInt(message_idx))
    max(dic(data.last, doc.group, {}), doc.write_at)

    if (doc.log?.length) {
      emit(data.say)
    }

    if (phase_idx.match(/[SGV]S?$/)) {
      emit(dic(data.potof, all_phase_id, {}, doc.potof_id, { count: 0, all: 0 }))
      emit(dic(data.potof, phase_id, {}, doc.potof_id, { count: 0, all: 0 }))
    }
    if (phase_idx.match(/.M?$/)) {
      max(dic(data.side, phase_id, {}, doc.potof_id, {}), doc.write_at)
    }

    for (const mention_id of doc.mention_ids) {
      dic(data.mention, mention_id, { count: 0 }).count++
      dic(data.mention_to, mention_id, {}, doc._id, { count: 0 }).count++
    }

    function emit(o: EMIT) {
      max(o, doc.write_at)
      min(o, doc.write_at)
      o.count++
      o.all += doc.log.length
    }

    function max<T>(dic: { max: T; max_is: typeof doc }, idx: T) {
      if (idx !== idx) return
      if (!(idx <= dic.max)) {
        dic.max = idx
        dic.max_is = doc
      }
    }
    function min<T>(dic: { min: T; min_is: typeof doc }, idx: T) {
      if (idx !== idx) return
      if (!(dic.min <= idx)) {
        dic.min = idx
        dic.min_is = doc
      }
    }
  },
  order(data, { sort }) {
    sort(data.list).asc((o) => o.write_at)
    for (const event_id in data.event) {
      sort(data.event[event_id]).asc((o) => o.write_at)
    }
  }
})
