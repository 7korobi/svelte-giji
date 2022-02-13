import type { presentation } from '../_type/string'
import { MapReduce } from 'svelte-map-reduce-store'
import json from '$lib/game/json/set_option.json'

export type OPTION_ID = keyof typeof json
export type Option = {
  _id: OPTION_ID
  label: presentation
  help: presentation
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
