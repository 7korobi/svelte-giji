import type { ShuffleFormat, Random, RandomEto } from '../store/random'

import { MapReduce } from '$lib/db/socket.io-client'
import { model } from '$lib/db/socket.io-server'

import json from '$lib/game/json/random.json'

const romans = 'I II III IV V VI VII VIII IX X XI XII XIII XIV XV XVI XVII XVIII XIX XX XXI'.split(
  ' '
)
const Randoms = MapReduce({
  format: () =>
    ({
      list: [],
      count: 0,
      all: 0
    } as ShuffleFormat & {
      [type: string]: ShuffleFormat
    }),
  reduce: (data, doc: Random) => {
    merge(data)
    for (const type of doc.types) {
      data[type] ??= {} as ShuffleFormat
      merge(data[type])
    }

    function merge(o: ShuffleFormat) {
      if (!o.list) {
        o.list = []
        o.count = 0
        o.all = 0
      }
      o.list.push(doc)
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
    if (['zodiac', 'tarot'].includes(type)) oo.roman = romans[order]
    Randoms.add([oo])
  }
}

;(function () {
  const ratio = 1
  const types = ['eto']
  const now_year = new Date().getFullYear()
  for (let idx = 0; idx < 60; ++idx) {
    const eto10 = '甲乙丙丁戊己庚辛壬癸'[idx % 10]
    const eto12 = '子丑寅卯辰巳午未申酉戌亥'[idx % 12]
    const a = Randoms.find(eto10) as RandomEto
    const b = Randoms.find(eto12) as RandomEto
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
  const suites = ['♢', '♡', '♣', '♠']
  const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ')
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

function choice(type: string) {
  const { list, all } = Randoms.data[type]
  let at = Math.random() * all
  for (const o of list) {
    at -= o.ratio
    if (at < 0) return o
  }
}

export const randoms = model({
  $match: (types: string[]) => types,
  query: async ($match) => Promise.resolve($match.map(choice))
})
