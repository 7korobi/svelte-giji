import { MapReduce, dic } from '$lib/map-reduce'
import json from '$lib/game/json/set_says.json'
import type { presentation } from '../_type/string'

export type SayLimit = {
  _id: string
  label: presentation
  say_act?: number
  say: number
  tsay: number
  spsay?: number
  wsay?: number
  xsay?: number
  gsay?: number
}

export const SayLimits = MapReduce({
  format: () => {
    return {
      list: [] as SayLimit[]
    }
  },
  reduce: (o, doc) => {},
  order: (o, { sort }) => {}
})

SayLimits.deploy(json)
