import type { CLANS, GROUPS, WINS } from '../_dic'

import type { Book } from '../log/book'
import type { Folder } from '../log/folder'
import type { Part } from '../log/part'
import type { Phase } from '../log/phase'
import type { Potof } from './potof'

export type Cards = Card[]
export type Card = {
  folder: Folder
  book: Book
  potof: Potof

  role: Role
  part: Part
  phase: Phase

  folder_id: string
  book_id: string
  potof_id: string

  role_id: string
  part_id: string
  phase_id: string

  idx: string
  date?: number
}

export type Stats = Stat[]
export type Stat = {
  folder: Folder
  book: Book
  potof: Potof

  able: Able

  folder_id: string
  book_id: string
  potof_id: string

  able_id: string

  idx: string

  label: string
}

export type Roles = Role[]
export type Role = {
  ables: Ables

  cmd?: 'role'
  able?: string

  win: WINS
  group: GROUPS
  label: string
  help?: string
}

export type RoleMap = {
  summary: Roles[]
  group: {
    [key in string]: {
      list: Roles
      count: number
    }
  }
  clan: {
    [key in CLANS | WINS]: {
      count: number
    }
  }
  win: {
    [key in WINS]: {
      count: number
    }
  }
}

export type Ables = Able[]
export type Able = {
  group: 'GM' | 'POTOF' | 'STATUS'
  at?: string
  cmd?: string
  btn?: string
  change?: string
  help?: string
  sw?: string
  pass?: string
  for?: string
  targets?: string
  target?: string
  require?: string
  label?: string

  disable?: string[]
  hide?: string[]
  text?: ('act' | 'memo' | 'talk')[]
}

export type AbleMap = {
  group: {
    [key: string]: {
      list: Ables
    }
  }
}
