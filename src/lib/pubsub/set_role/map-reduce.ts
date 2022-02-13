import type { ARY, DIC } from 'svelte-map-reduce-store'
import type { ABLE_ID, WIN } from '../map-reduce'
import type { presentation } from '../_type/string'

import { MapReduce, dic } from 'svelte-map-reduce-store'
import set_role_gifts from '$lib/game/json/set_role_gifts.json'
import set_role_lives from '$lib/game/json/set_role_lives.json'
import set_role_mobs from '$lib/game/json/set_role_mobs.json'
import set_role_specials from '$lib/game/json/set_role_specials.json'
import set_role_traps from '$lib/game/json/set_role_traps.json'
import set_role_turns from '$lib/game/json/set_role_turns.json'
import set_roles from '$lib/game/json/set_roles.json'

export type GIFT_ID = keyof typeof set_role_gifts
export type LIVE_ID = keyof typeof set_role_lives
export type MOB_ID = keyof typeof set_role_mobs
export type SPECIAL_ID = keyof typeof set_role_specials
export type TRAP_ID = keyof typeof set_role_traps
export type TURN_ID = keyof typeof set_role_turns
export type ROLE_ID =
  | SPECIAL_ID
  | TURN_ID
  | MOB_ID
  | TRAP_ID
  | LIVE_ID
  | GIFT_ID
  | keyof typeof set_roles

export type Role = GiftRole | LiveRole | MobRole | SpecialRole | TrapRole | TurnRole | TitleRole

type TrapRole = {
  _id: TRAP_ID
  group: 'TRAP'
  win: null
  able_ids: ABLE_ID[]
  label: presentation
  help: presentation
}

type TurnRole = {
  _id: TURN_ID
  group: 'TURN'
  win: null
  able_ids: ABLE_ID[]
  label: presentation
  help: presentation
}

type LiveRole = {
  _id: LIVE_ID
  group: 'LIVE' | null
  win: null
  able_ids: ABLE_ID[]
  label: presentation
  help: presentation
}

export type MobRole = {
  _id: MOB_ID
  group: 'MOB'
  win: 'MOB' | 'HUMAN'
  able_ids: ABLE_ID[]
  label: presentation
  help: presentation
}

type SpecialRole = {
  _id: SPECIAL_ID
  group: 'SPECIAL'
  win: null
  able_ids: ABLE_ID[]
  label: presentation
  help: presentation
}

type GiftRole = {
  _id: GIFT_ID
  group: 'GIFT'
  win: WIN | null
  able_ids: ABLE_ID[]
  able?: presentation
  cmd?: 'role'
  label: presentation
  help: presentation
}

type TitleRole = HumanRole | EvilRole | WolfRole | PixiRole | OtherRole | BindRole | disabledRole
type HumanRole = {
  _id: ROLE_ID
  group: 'HUMAN'
  win: 'HUMAN'
  able_ids: ABLE_ID[]
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type EvilRole = {
  _id: ROLE_ID
  group: 'EVIL'
  win: 'EVIL'
  able_ids: ABLE_ID[]
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type WolfRole = {
  _id: ROLE_ID
  group: 'WOLF'
  win: 'WOLF' | 'LONEWOLF'
  able_ids: ABLE_ID[]
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type PixiRole = {
  _id: ROLE_ID
  group: 'PIXI'
  win: 'PIXI'
  able_ids: ABLE_ID[]
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type OtherRole = {
  _id: ROLE_ID
  group: 'OTHER'
  win: 'HATER' | 'LOVER' | 'GURU' | 'DISH'
  able_ids: ABLE_ID[]
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type BindRole = {
  _id: ROLE_ID
  group: 'BIND'
  win: 'HATER' | 'LOVER'
  able_ids: ABLE_ID[]
  able?: presentation
  cmd: 'role'
  label: presentation
  help: presentation
}

type disabledRole = {
  _id: ROLE_ID
  group: undefined
  win: WIN
  able_ids: ABLE_ID[]
  able?: presentation
  cmd?: 'role'
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

Roles.deploy(set_role_gifts)
Roles.deploy(set_role_lives)
Roles.deploy(set_role_mobs)
Roles.deploy(set_role_specials)
Roles.deploy(set_role_traps)
Roles.deploy(set_role_turns)
Roles.deploy(set_roles)
