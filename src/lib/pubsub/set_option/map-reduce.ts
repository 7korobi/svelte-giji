import { MapReduce } from '$lib/map-reduce'
import json from '$lib/game/json/set_option.json'
import type { presentation } from '../_type/string'

export type OPTION_ID = keyof typeof json
export type Option = {
  _id: OPTION_ID
  label: presentation
  help: string
}

export const Options = MapReduce({
  format: () => {
    return {
      list: [] as Option[]
    }
  },
  reduce: (o, doc) => {},
  order: (o, { sort }) => {}
})

Options.deploy(json)
