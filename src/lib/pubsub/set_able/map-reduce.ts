import type { DIC } from '$lib/map-reduce'
import type { presentation } from '../_type/string'

import { MapReduce, dic } from '$lib/map-reduce'
import json from '$lib/game/json/set_ables.json'

export type ABLE_ID = keyof typeof json
export type CMD_ID = typeof CMD_IDS[number]
export type HIDE_ID = typeof HIDE_IDS[number]

export const ABLE_IDS = Object.keys(json) as ABLE_ID[]
export const CMD_IDS = [
  'editvilform',
  'muster',
  'update',
  'scrapvil',
  'exit',
  'commit',
  'vote',
  'gamemaster',
  'maker',
  'kick',
  'entry',
  'write'
] as const
export const HIDE_IDS = ['vote', 'gift', 'role', 'poison', 'analeptic']

export type Able = {
  _id: ABLE_ID
  group?: 'GM' | 'POTOF' | 'STATUS'
  at?: 'start' | 'prologue' | 'progress' | 'around' | 'all'
  for?: 'cast' | 'live' | 'dead' | 'gm_live' | 'gm_dead'
  hide?: HIDE_ID[]
  disable?: HIDE_ID[]
  cmd?: CMD_ID
  text?: ('talk' | 'memo' | 'act')[]
  sw?: presentation
  pass?: presentation
  target?: presentation
  btn?: presentation
  change?: presentation
  help: presentation
}

export const Ables = MapReduce({
  format: () => {
    return {
      list: [] as Able[],
      hide: new Set(),
      group: {} as DIC<{ list: Able[] }>
    }
  },
  reduce: (o, doc) => {
    if (doc.hide) o.hide.add(doc.hide)
    dic(o.group, doc.group, {}, 'list', []).push(doc)
  },
  order: (o, { sort }) => {}
})

Ables.deploy(json)
