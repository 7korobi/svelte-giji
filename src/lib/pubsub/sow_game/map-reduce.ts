import { MapReduce } from '$lib/map-reduce'
import json from '$lib/game/json/sow_game.json'
import type { presentation } from '../_type/string'

export type GAME_ID = keyof typeof json
export type Game = {
  _id: string
  label: presentation
  path: string
}

export const Games = MapReduce({
  format: () => {
    return {
      list: [] as Game[]
    }
  },
  reduce: (o, doc) => {},
  order: (o, { sort }) => {}
})

Games.deploy(json)
