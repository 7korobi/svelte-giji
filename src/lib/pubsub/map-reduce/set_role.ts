import type { ARY, DIC } from '$lib/map-reduce'
import type { ABLE_ID, WIN } from '.'
import type { presentation } from '../type/string'

import { MapReduce, dic } from '$lib/map-reduce'
import json from '$lib/game/json/set_roles.json'

export type ROLE_ID = keyof typeof json
export type Role =
  | disabledRole
  | HideRole
  | EventRole
  | TurnRole
  | LiveRole
  | MobRole
  | MakerRole
  | GiftRole
  | TitleRole

type disabledRole = {
  _id: ROLE_ID
  group: undefined
  win: WIN
  able_ids: ABLE_ID
  able?: presentation
  cmd?: 'role'
  label: presentation
  help: presentation
}

type HideRole = {
  _id: ROLE_ID
  group: null
  win: null
  able_ids: ABLE_ID
  label: presentation
  help: presentation
}

type EventRole = {
  _id: ROLE_ID
  group: 'EVENT'
  win: null
  able_ids: ABLE_ID
  label: presentation
  help: presentation
}

type TurnRole = {
  _id: ROLE_ID
  group: 'TURN'
  win: null
  able_ids: ABLE_ID
  label: presentation
  help: presentation
}

type LiveRole = {
  _id: ROLE_ID
  group: 'LIVE'
  win: null
  able_ids: ABLE_ID
  label: presentation
  help: presentation
}

type MobRole = {
  _id: ROLE_ID
  group: 'MOB'
  win: 'MOB' | 'HUMAN'
  able_ids: ABLE_ID
  label: presentation
  help: presentation
}

type MakerRole = {
  _id: ROLE_ID
  group: 'SPECIAL'
  win: null
  able_ids: ABLE_ID
  label: presentation
  help: presentation
}

type GiftRole = {
  _id: ROLE_ID
  group: 'GIFT'
  win: WIN | null
  able_ids: ABLE_ID
  able?: presentation
  cmd?: 'role'
  label: presentation
  help: presentation
}

type TitleRole = HumanRole | EvilRole | WolfRole | PixiRole | OtherRole | BindRole
type HumanRole = {
  _id: ROLE_ID
  group: 'HUMAN'
  win: 'HUMAN'
  able_ids: ABLE_ID
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type EvilRole = {
  _id: ROLE_ID
  group: 'EVIL'
  win: 'EVIL'
  able_ids: ABLE_ID
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type WolfRole = {
  _id: ROLE_ID
  group: 'WOLF'
  win: 'WOLF' | 'LONEWOLF'
  able_ids: ABLE_ID
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type PixiRole = {
  _id: ROLE_ID
  group: 'PIXI'
  win: 'PIXI'
  able_ids: ABLE_ID
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type OtherRole = {
  _id: ROLE_ID
  group: 'OTHER'
  win: 'HATER' | 'LOVER' | 'GURU' | 'DISH'
  able_ids: ABLE_ID
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type BindRole = {
  _id: ROLE_ID
  group: 'BIND'
  win: 'HATER' | 'LOVER'
  able_ids: ABLE_ID
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

export const Roles = MapReduce({
  format: () => {
    return {
      list: [] as Role[],
      group: {} as DIC<{ list: Role[] }>
    }
  },
  reduce: (o, doc) => {
    dic(o.group, doc.group, {}, 'list', []).push(doc)
  },
  order: (o, { sort }) => {}
})

const list: Role[] = []
for (const _id in json) {
  const o = json[_id]
  o._id = _id
  list.push(o)
}
Roles.add(list)
