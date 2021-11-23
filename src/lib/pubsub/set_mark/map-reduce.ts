import type { presentation } from '../_type/string'
import { MapReduce } from '$lib/map-reduce'
import json from '$lib/game/json/set_mark.json'

export type MARK_ID = keyof typeof json
export type Mark = {
  _id: MARK_ID
  label: presentation
  file: string
}

export const Marks = MapReduce({
  format: () => {
    return {
      list: [] as Mark[]
    }
  },
  reduce: (o, doc) => {},
  order: (o, { sort }) => {}
})

Marks.deploy(json)
