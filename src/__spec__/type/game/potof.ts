import type { Face } from '../log/face'
import type { Book } from '../log/book'

import type { Icons } from './activity'
import type { Ables, Cards, Role, Roles, Stats } from './card'

export type Potofs = Potof[]
export type Potof = {
  book: Book
  face: Face
  role: Role

  icons: Icons
  cards: Cards
  roles: Roles
  ables: Ables
  stats: Stats

  write_at: number

  name: string
  job: string
  sign: string
  csid: string
  history: string[]
}
