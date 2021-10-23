import type { presentation } from '../type/string'

import { model } from '$lib/db/socket.io-client'

export type RandomEto = {
  _id: string
  types: ['eto']

  name: presentation
  year: number
}

export type RandomTrump = {
  _id: number
  types: ['trump']

  suite: presentation
  rank: presentation
  number: number
}

export type Random = {
  order: number
  ratio: number
  label: presentation
  choice?: presentation
} & (
  | {
      _id: string
      types: string[]

      name: presentation
      roman?: presentation
      hebrew?: presentation
      symbol?: presentation
    }
  | RandomEto
  | RandomTrump
)

export type ShuffleFormat = {
  list: Random[]
  count: number
  all: number
}

export const randoms = model({
  qid: (types: string[]) => types.join(':'),
  format: () => ({
    list: [] as Random[],
    sum: 0
  }),
  reduce: (data, doc: Random) => {
    const { number } = doc as RandomTrump
    if (number) {
      data.sum += number
    }
  },
  order: (data, { sort }) => {}
})
