import { MapReduce } from '$lib/map-reduce'
import json from '$lib/game/json/set_locale.json'
import type { presentation } from '../_type/string'

export type LOCALE_ID = keyof typeof json
export type Locale = {
  _id: string
  label: presentation
  path: string
}

export const Locales = MapReduce({
  format: () => {
    return {
      list: [] as Locale[]
    }
  },
  reduce: (o, doc) => {},
  order: (o, { sort }) => {}
})

Locales.deploy(json)
