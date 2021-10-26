import type { presentation } from '../type/string'
import type { DIC } from '$lib/map-reduce'

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
    base: {} as DIC<DIC<{ list: Tag[] }>>,
    group: {} as { list: Tag[] }[][]
  }),
  reduce: (data, doc: Tag) => {
    const group = Math.floor(doc.order / 1000)
    dic(data.base, doc.head, {}, group.toString(), {}, 'list', []).push(doc)
  },
  order: (data, { sort, group_sort }) => {
    data.group = group_sort(
      data.base,
      (d) => sort(d).asc((o) => o[0].list[0].order),
      (d) => sort(d).asc((o) => o.list[0].order),
      (d) => ({ list: sort(d.list).asc((o) => o.order) })
    )
  }
})

for (const _id in json) {
  const o = json[_id]
  o._id = _id
  Tags.add([o])
}
