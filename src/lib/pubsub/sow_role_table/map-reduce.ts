import { MapReduce } from '$lib/map-reduce'
import json from '$lib/game/json/sow_roletables.json'
import type { presentation } from '../_type/string'

export type ROLE_TABLE_ID = keyof typeof json
export type RoleTable = {
  _id: string
  label: presentation
  path: string
}

export const RoleTables = MapReduce({
  format: () => {
    return {
      list: [] as RoleTable[]
    }
  },
  reduce: (o, doc) => {},
  order: (o, { sort }) => {}
})

RoleTables.deploy(json)
