import type { GROUPS, HANDLES } from '../_dic'
import type { Book } from './book'
import type { Chats } from './chat'
import type { Folder } from './folder'
import type { Part } from './part'
import type { Mark } from '../game/game'

export type Phases = Phase[]
export type Phase = {
  folder: Folder
  book: Book
  part: Part
  mark: Mark
  chats: Chats

  write_at: number

  is_guide: boolean
  is_update?: boolean

  name: string
  group: GROUPS
  handle: HANDLES
}

export type PhaseMap = {
  group: { id: GROUPS; count: number }[]
  handle: { id: HANDLES; count: number }[]
}
