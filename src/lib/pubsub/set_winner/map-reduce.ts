import { MapReduce } from '$lib/map-reduce'
import json from '$lib/game/json/set_winner.json'
import type { presentation } from '../_type/string'

export type WINNER_ID = keyof typeof json
export type Winner = {
  _id: WINNER_ID
  label: presentation
  help: presentation
}

export const Winners = MapReduce({
  format: () => {
    return {
      list: [] as Winner[]
    }
  },
  reduce: (o, doc) => {},
  order: (o, { sort }) => {}
})

Winners.deploy(json)
