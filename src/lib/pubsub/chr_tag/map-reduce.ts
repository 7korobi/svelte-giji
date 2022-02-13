import type { ARY, DIC } from 'svelte-map-reduce-store'
import type { presentation } from '../_type/string'
import type { CHR_SET_IDX, Face } from '../map-reduce'
import { MapReduce, dic } from 'svelte-map-reduce-store'

import json from '$lib/game/json/chr_tag.json'

export type TAG_ID = keyof typeof json

export type Tag = {
  _id: TAG_ID
  tag_id: string
  chr_set_id: CHR_SET_IDX
  order: number
  label: presentation
  long: presentation
  head: presentation
  faces: Face[]
  face_sort: ['face.order' | 'face.q.head', 'asc']
}

export const Tags = MapReduce({
  format: () => ({
    list: [] as Tag[],
    base: {} as DIC<DIC<{ list: Tag[] }>>,
    group: {} as ARY<ARY<{ list: Tag[] }>>
  }),
  reduce: (data, doc) => {
    const group = Math.floor(doc.order / 1000)
    dic(data.base, doc.head, {}, group.toString(), {}, 'list', []).push(doc)
  },
  order: (data, { sort, group_sort }) => {
    data.group = group_sort(
      data.base,
      (d) => sort(d).asc((o) => o[0].list[0].order),
      (d) => sort(d).asc((o) => o.list[0].order),
      (d) => {
        d.list = sort(d.list).asc((o) => o.order)
        return d
      }
    )
  }
})

Tags.deploy(json)
