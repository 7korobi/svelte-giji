import type { presentation } from '../_type/string'
import type { ROLE_ID } from '../map-reduce'
import { MapReduce } from '$lib/map-reduce'
import json from '$lib/game/json/sow_roletables.json'

export type ROLE_TABLE_ID = keyof typeof json
export type RoleTable = {
  _id: ROLE_TABLE_ID
  label: presentation
  role_ids_list: ROLE_ID[][]
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
