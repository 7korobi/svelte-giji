import { Bits } from '$lib/inline/bits'

export type VILLAGE_MODES = typeof VILLAGE_MODES[number]
export type MONTHS = typeof MONTHS[number]

export type CLANS = typeof CLANS[number]
export type GROUPS = typeof GROUPS[number]

export type ROLETABLES = typeof ROLETABLES[number]

export type STYLES = typeof STYLES[number]
export type SHOWS = typeof SHOWS[number]
export type HANDLES = typeof HANDLES[number]
export type BOOK_OPTIONS = typeof BOOK_OPTIONS[number]
export type LOCALES = typeof LOCALES[number]

export const Switch = {
  show: ['pin', 'toc', 'potof', 'current', 'search', 'magnify', 'side', 'link', 'mention'],
  option: ['impose', 'swipe_page', 'is_used']
} as const

export const ShowBits = new Bits(Switch.show, {})
export const OptionBits = new Bits(Switch.option, {})

export const MONTHS = [
  '01月',
  '02月',
  '03月',
  '04月',
  '05月',
  '06月',
  '07月',
  '08月',
  '09月',
  '10月',
  '11月',
  '12月'
] as const

export const GROUPS = [
  '',
  'EVENT',
  'TURN',
  'GIFT',
  'LIVE',
  'BIND',
  'SPECIAL',
  'MOB',
  'WOLF',
  'EVIL',
  'OTHER'
] as const
export const CLANS = ['null', 'EVENT', 'GIFT', 'LIVE', 'MAIN'] as const

export const VILLAGE_MODES = ['oldlog', 'prologue', 'progress'] as const

export const SHOWS = ['talk', 'post', 'report'] as const
export const STYLES = ['plain', 'mono', 'head'] as const

export const LOCALES = [
  'all',
  'complexx',
  'heavy',
  'millerhollow',
  'regend',
  'secret',
  'sow',
  'star',
  'tabula',
  'ultimate'
] as const
