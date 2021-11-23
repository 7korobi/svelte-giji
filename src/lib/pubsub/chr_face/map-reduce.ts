import type { ARY, DIC } from '$lib/map-reduce'
import type { presentation } from '../_type/string'
import type { ChrJob, Tag } from '../map-reduce'
import { MapReduce, dic } from '$lib/map-reduce'
import json from '$lib/game/json/chr_face.json'

export type FacesFormat = {
  list: Face[]
  tag?: Tag
  chr_jobs?: ChrJob[]
  name_head: string[][]
  name_head_dic: DIC<string[]>
}

export type Face = {
  _id: string
  tag_ids: string[]
  tags?: Tag[]
  yml_idx: number

  order: number

  name: presentation
  comment: presentation
}

const katakanas = (() => {
  const result: string[] = []
  let start = 'ア'.charCodeAt(0)
  let end = 'ン'.charCodeAt(0)
  let idx = start
  for (; idx <= end; idx++) {
    result.push(String.fromCharCode(idx))
  }
  return result
})()

export const Faces = MapReduce({
  format: () => ({
    list: [] as Face[],
    remain: [] as string[],
    cover: [] as string[],
    tag: {} as DIC<FacesFormat>
  }),
  reduce: (data, doc) => {
    let name = doc.name.slice(0)
    if (doc.name.startsWith('†')) name = doc.name.slice(1)
    if (doc.name.startsWith('D.')) name = doc.name.slice(2)
    if (doc.name.startsWith('Dr.')) name = doc.name.slice(3)
    name = name.replace(/[\u3041-\u3096]/g, (hira) =>
      String.fromCharCode(hira.charCodeAt(0) + 0x60)
    )
    const head = name[0]
    doc.tag_ids.unshift('all')

    for (const tag_id of doc.tag_ids) {
      emit(dic(data.tag, tag_id, {}))
    }

    function emit(o: FacesFormat) {
      if (!o.list) {
        o.list = []
        o.name_head_dic = {} as DIC<string[]>
      }
      o.list.push(doc)
      dic(o.name_head_dic, head, []).push(doc.name)
    }
  },
  order: (data, { sort }) => {
    for (const kana of katakanas) {
      if (data.tag.all.name_head_dic[kana]) {
        data.cover.push(kana)
      } else {
        data.remain.push(kana)
      }
    }
    for (const tag_id in data.tag) {
      sort(data.tag[tag_id].list).asc((o) => o.order)
      data.tag[tag_id].name_head = sort(data.tag[tag_id].name_head_dic).desc((o) => o.length)
    }
  }
})

json.forEach((o: Face, idx) => {
  o.yml_idx = idx
})

Faces.add(json as Face[])
