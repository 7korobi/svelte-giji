import type { presentation } from '../type/string'

import { model } from '$lib/db/socket.io-client'
import { MapReduce, dic } from '$lib/map-reduce'
import json from '$lib/game/json/chr_tag.json'

export type Tag = {
  _id: string
  tag_id: string
  chr_set_id: string
  order: number
  label: presentation
  long: presentation
  head: presentation
  face_sort: ['face.order' | 'face.q.head', 'asc']
}

export const Tags = MapReduce({
  format: () => ({
    list: [] as Tag[],
    group: {} as {
      list: Tag[]
    }[][]
  }),
  reduce: (data, doc: Tag) => {
    const group = Math.floor(doc.order / 1000)
    dic(data.group, doc.head as any, {} as [], group.toString() as any, {}, 'list', []).push(doc)
  },
  order: (data, { sort }) => {
    for (const head in data.group) {
      for (const group in data.group[head]) {
        sort(data.group[head][group].list).asc((o) => o.order)
      }
      // data.group[head] = sort(data.group[head]).asc((o) => o.list[0].order)
    }
    // data.group = sort(data.group).asc((o) => o[0].list[0].order)
  }
})

for (const _id in json) {
  const o = json[_id]
  o._id = _id
  Tags.add([o])
}
console.log(Tags.data)
