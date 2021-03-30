import type { Cards, Stats } from '../game/card'
import type { Sections } from '../game/game'
import type { Book } from './book'
import type { Chats } from './chat'
import type { Folder } from './folder'
import type { Phases } from './phase'

export type Parts = Part[]
export type Part = {
  folder: Folder
  book: Book

  sections: Sections
  phases: Phases
  cards: Cards
  stats: Stats
  chats: Chats
}
