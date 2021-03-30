import type { RANDOM_TYPES, RANKS, SUITES } from './_dic'

export type Randoms = Random[]
export type Random = {
  texts: [string] | [string, string]
  types: RANDOM_TYPES[]

  ratio: number
  order: number
  year?: number
  number?: number

  label: string
  name?: string
  hebrew?: string
  roman?: string
  symbol?: string
  suite?: SUITES
  rank?: RANKS
}
