import type { DIC } from 'svelte-map-reduce-store'
import type { presentation } from '../_type/string'

import { MapReduce, dic } from 'svelte-map-reduce-store'
import json from '$lib/game/json/random.json'

export type RANDOM_TYPE = 'eto' | 'trump' | keyof typeof json

export type ShuffleFormat = {
  list: Random[]
  count: number
  all: number
}

export type Random = {
  _id: string | number
  types: RANDOM_TYPE[]

  order: number
  ratio: number
  label: presentation

  name?: presentation
  hebrew?: presentation
  symbol?: presentation
  choice?: presentation

  year?: number
  number?: number

  rank?: typeof RANKS[number]
  suite?: typeof SUITES[number]
  roman?: typeof ROMANS[number]
}

export type SUITES = typeof SUITES[number]
export type RANKS = typeof RANKS[number]
export type ROMANS = typeof ROMANS[number]

export const RANDOM_TYPES = [
  'eto',
  'eto10',
  'eto12',
  'trump',
  'tarot',
  'zodiac',
  'planet',
  'chess',
  'coin',
  'weather'
] as const
export const SUITES = ['', '♢', '♡', '♣', '♠'] as const
export const RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const
export const ROMANS = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
  'XXI'
] as const

export const Randoms = MapReduce({
  format: () => ({
    list: [] as Random[],
    count: 0,
    all: 0,
    type: {} as DIC<ShuffleFormat>
  }),
  reduce: (data, doc) => {
    emit(data)
    for (const type of doc.types) {
      const o = dic(data.type, type, {})
      emit(o)
      o.list.push(doc)
    }

    function emit(o: ShuffleFormat) {
      if (!o.list) {
        o.list = []
        o.count = 0
        o.all = 0
      }
      o.count += 1
      o.all += doc.ratio
    }
  },
  order: (data, { sort }) => {}
})

for (const type in json) {
  const o = json[type]
  let order = 0
  for (const key in o) {
    const oo = o[key]
    order++
    oo.order = order
    oo.name ??= key
    oo.label ??= key
    oo.ratio ??= 1
    oo.types ??= []
    if (!oo.types.includes(type)) oo.types.push(type)

    oo._id = (oo.name || oo.label || key).replace(/ /g, '')
    if (['eto10', 'eto12'].includes(type)) oo._id = key
    if (['zodiac', 'tarot'].includes(type)) oo.roman = ROMANS[order]
    Randoms.add([oo])
  }
}

;(function () {
  const ratio = 1
  const types: RANDOM_TYPE[] = ['eto']
  const now_year = new Date().getFullYear()
  for (let idx = 0; idx < 60; ++idx) {
    const eto10 = '甲乙丙丁戊己庚辛壬癸'[idx % 10]
    const eto12 = '子丑寅卯辰巳午未申酉戌亥'[idx % 12]
    const a = Randoms.find(eto10)
    const b = Randoms.find(eto12)
    const name = `${a.name.replace(/と$/, 'との')}${b.name}`
    const year = idx + 1984
    const order = idx + 1
    const label = `${eto10}${eto12}`
    const _id = label
    Randoms.add([{ _id, order, types, ratio, label, name, year }])
  }
})()
;(function () {
  const ratio = 1
  const suites = SUITES.slice(1)
  const ranks = RANKS
  suites.forEach((suite, idx1) => {
    ranks.forEach((rank, idx2) => {
      const label = `${suite}${rank}`
      const suite_code = idx1 + 1
      const number = idx2 + 1
      const order = 100 * suite_code + number
      const _id = order
      Randoms.add([{ _id, order, types: ['trump'], ratio, number, suite, rank, label }])
    })
  })
})()

Randoms.add([
  {
    _id: 501,
    order: 501,
    types: ['trump'],
    ratio: 1,
    number: 0,
    suite: '',
    rank: '',
    label: 'JOKER'
  },
  {
    _id: 502,
    order: 502,
    types: ['trump'],
    ratio: 1,
    number: 0,
    suite: '',
    rank: '',
    label: 'joker'
  }
])
