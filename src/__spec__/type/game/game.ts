import type { LOCALES } from '../_dic'

export type Games = Game[]
export type Game = {}

export type Sections = Section[]
export type Section = {
  begin_at: number
  write_at: number
}

export type Locales = Locale[]
export type Locale = {
  sow_locale_id: LOCALES
  label: string
  help?: string
  intro?: string[]
}

export type Marks = Mark[]
export type Mark = {
  label?: string
  path: string
  enable?: boolean
}

export type Winners = Winner[]
export type Winner = {
  order: number
  group: string
  label: string
  label_human?: string
  help?: string
}

export type Options = Option[]
export type Option = {}

export type Says = Say[]
export type Say = {
  label: string
  help: string
  recovery?: '24h'
  disabled?: boolean
  for: string[]
  max: {
    size: number
    word: number
    line: number
  }
  all?: {
    SSAY?: number
    TSAY?: number
    VSAY?: number
    PSAY?: number
    WSAY?: number
    XSAY?: number
    GSAY?: number
    VGSAY?: number
  }
  count?: {
    SSAY?: number
    TSAY?: number
    VSAY?: number
    PSAY?: number
    WSAY?: number
    XSAY?: number
    GSAY?: number
    VGSAY?: number
  }
}
