import { MapReduce, dic } from '$lib/map-reduce'
import json from '$lib/game/json/set_says.json'
import type { presentation } from '../_type/string'

export type SAY_LIMIT_ID = keyof typeof json
export type PhaseLimits = {
  SSAY: number
  GSAY: number
  TSAY: number
  VSSAY: number
  VGSAY: number
  PSAY: number
  WSAY: number
  XSAY: number
}
export type SayLimit = {
  _id: SAY_LIMIT_ID
  label: presentation
  help: presentation

  recovery?: '24h'
  unit: '回' | 'pt'

  count?: PhaseLimits
  all?: PhaseLimits
  max: {
    size: number
    word: number
    line: number
  }
}

export const SayLimits = MapReduce({
  format: () => {
    return {
      list: [] as SayLimit[]
    }
  },
  initialize: (doc) => {
    if (doc.count) doc.unit = '回'
    if (doc.all) doc.unit = 'pt'
  },
  reduce: (o, doc) => {},
  order: (o, { sort }) => {}
})

SayLimits.deploy(json)
