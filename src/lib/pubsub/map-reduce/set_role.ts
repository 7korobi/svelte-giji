import type { ARY, DIC } from '$lib/map-reduce'
import type { WIN } from '.'
import type { presentation } from '../type/string'

import { MapReduce, dic } from '$lib/map-reduce'
import json from '$lib/game/json/set_roles.json'

export type Role = disabledRole | HideRole | EventRole | TurnRole | LiveRole | MobRole | MakerRole | GiftRole | TitleRole 

type disabledRole = {
	group: undefined
	win: WIN
	able_ids: string
	able?: presentation
	cmd?: 'role'
	label: presentation
	help: presentation
}

type HideRole = {
	group: null
	win: null
	able_ids: string
	label: presentation
	help: presentation
}

type EventRole = {
	group: 'EVENT'
	win: null
	able_ids: string
	label: presentation
	help: presentation
}

type TurnRole = {
	group: 'TURN'
	win: null
	able_ids: string
	label: presentation
	help: presentation
}

type LiveRole = {
	group: 'LIVE'
	win: null
	able_ids: string
	label: presentation
	help: presentation
}

type MobRole = {
	group: 'MOB'
	win: 'MOB' | 'HUMAN'
	able_ids: string
	label: presentation
	help: presentation
}

type MakerRole = {
	group: 'SPECIAL'
	win: null
	able_ids: string
	label: presentation
	help: presentation
}

type GiftRole = {
	group: 'GIFT'
	win: WIN | null
	able_ids: string
	able?: presentation
	cmd?: 'role'
	label: presentation
	help: presentation
}

type TitleRole = HumanRole | EvilRole | WolfRole | PixiRole | OtherRole | BindRole
type HumanRole = {
	group: 'HUMAN'
	win: 'HUMAN'
	able_ids: string
	able?: presentation
	cmd: 'role'
	label: presentation
	help: presentation
}

type EvilRole = {
	group: 'EVIL'
	win: 'EVIL'
	able_ids: string
	able?: presentation
	cmd: 'role'
	label: presentation
	help: presentation
}

type WolfRole = {
	group: 'WOLF'
	win: 'WOLF' | 'LONEWOLF'
	able_ids: string
	able?: presentation
	cmd: 'role'
	label: presentation
	help: presentation
}

type PixiRole = {
	group: 'PIXI'
	win: 'PIXI'
	able_ids: string
	able?: presentation
	cmd: 'role'
	label: presentation
	help: presentation
}

type OtherRole = {
	group: 'OTHER' 
	win: 'HATER' | 'LOVER' | 'GURU' | 'DISH'
	able_ids: string
	able?: presentation
	cmd: 'role'
	label: presentation
	help: presentation
}

type BindRole = {
	group: 'BIND'
	win: 'HATER' | 'LOVER'
	able_ids: string
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
		dic(o.group, doc.group,{}, 'list', []).push(doc)
	},
  order: (o, { sort }) => {}
})

const list: Role[] = []
for(const _id in json) {
	const o = json[_id]
	o._id = _id
	list.push(o)
}
Roles.add(list)
