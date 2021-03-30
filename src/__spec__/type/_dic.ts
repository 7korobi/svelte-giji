import { Bits } from '../../lib/bits'

export function I18n() {}

export type Welcomes = typeof Switch['welcome'][number]
export type BGS = typeof Switch['bg'][number]
export type LOGS = typeof Switch['log'][number]
export type FONTS = typeof Switch['font'][number]
export type THEMES = typeof Switch['theme'][number]

export type RANDOM_TYPES = typeof RANDOM_TYPES[number]
export type FOLDER_IDS = typeof FOLDER_IDS[number]
export type VILLAGE_MODES = typeof VILLAGE_MODES[number]
export type MONTHS = typeof MONTHS[number]
export type SUITES = typeof SUITES[number]
export type RANKS = typeof RANKS[number]

export type CLANS = typeof CLANS[number]
export type GROUPS = typeof GROUPS[number]
export type WINS = typeof WINS[number]

export type CHR_SET_IDS = typeof CHR_SET_IDS[number]
export type CSIDS = typeof CSIDS[number]
export type SAYCNTS = typeof SAYCNTS[number]
export type TRSIDS = typeof TRSIDS[number]
export type GAMES = typeof GAMES[number]
export type ROLETABLES = typeof ROLETABLES[number]

export type VOTETYPES = typeof VOTETYPES[number]
export type STYLES = typeof STYLES[number]
export type SHOWS = typeof SHOWS[number]
export type HANDLES = typeof HANDLES[number]
export type BOOK_OPTIONS = typeof BOOK_OPTIONS[number]
export type LOCALES = typeof LOCALES[number]

export type BOOLS = 0 | 1

export const Switch = {
  show: ['pin', 'toc', 'potof', 'current', 'search', 'magnify', 'side', 'link', 'mention'],
  option: ['impose', 'swipe_page', 'is_used'],
  welcome: ['finish', 'progress'],
  bg: ['BG', 'BG75', 'BG50'],
  log: ['day', 'snow', 'night'],
  font: ['novel', 'large', 'press', 'goth-L', 'goth-M', 'goth-S'],
  theme: ['cinema', 'pop', 'snow', 'star', 'night', 'moon', 'wa']
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

export const RANDOM_TYPES = [
  'eto',
  'eto10',
  'eto12',
  'trump',
  'tarot',
  'zodiac',
  'planet',
  'weather',
  'chess',
  'coin',
  'weather'
] as const
export const SUITES = ['', '♢', '♡', '♣', '♠'] as const
export const RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const

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
export const WINS = [
  'NONE',
  'HUMAN',
  'EVIL',
  'WOLF',
  'PIXI',
  'HATER',
  'LOVER',
  'LONEWOLF',
  'GURU',
  'DISH',
  'MOB'
] as const

export const VILLAGE_MODES = ['oldlog', 'prologue', 'progress'] as const

export const FOLDER_IDS = [
  'TEST',
  'LOBBY',
  'OFFPARTY',
  'WOLF',
  'ALLSTAR',
  'ULTIMATE',
  'CABALA',
  'MORPHE',
  'SOYBEAN',

  'RP',
  'PRETENSE',
  'PERJURY',
  'XEBEC',
  'CRAZY',
  'CIEL',
  'DAIS'
] as const

export const CHR_SET_IDS = [
  'ririnra',
  'wa',
  'time',
  'sf',
  'fable',
  'mad',
  'ger',
  'changed',
  'animal',
  'school',
  'all'
] as const

export const CSIDS = [
  'ririnra',
  'ririnra_c01',
  'ririnra_c05',
  'ririnra_c08',
  'ririnra_c19',
  'ririnra_c67',
  'ririnra_c68',
  'ririnra_c72',
  'ririnra_c51',
  'ririnra_c20',
  'ririnra_c32',
  'all',
  'mad',
  'mad_mad05',
  'time',
  'ger',
  'animal',
  'school',
  'changed',
  'changed_m05',
  'SF',
  'SF_sf10',
  'wa',
  'wa_w23'
] as const

export const GAMES = [
  'TABULA',
  'LIVE_TABULA',
  'MILLERHOLLOW',
  'LIVE_MILLERHOLLOW',
  'TROUBLE',
  'MISTERY',
  'SECRET'
] as const

export const SAYCNTS = [
  'lobby',
  'say5',
  'tiny',
  'weak',
  'vulcan',
  'infinity',
  'wbbs',
  'euro',
  'juna',
  'sow'
] as const

export const TRSIDS = [
  'sow',
  'all',
  'star',
  'regend',
  'heavy',
  'complexx',
  'tabula',
  'millerhollow',
  'ultimate'
] as const

export const VOTETYPES = ['anonymity', 'sign'] as const

export const SHOWS = ['talk', 'post', 'report'] as const
export const STYLES = ['plain', 'mono', 'head'] as const
export const HANDLES = [
  'TITLE',
  'MAKER',
  'ADMIN',
  'AIM',
  'GAIM',
  'TSAY',
  'SSAY',
  'VSSAY',
  'MSAY',
  'GSAY',
  'VGSAY',
  'WSAY',
  'PSAY',
  'HSAY',
  'LSAY',
  'XSAY',
  'FSAY',
  'ELSE',
  'hide',
  'private',
  'public'
] as const

export const BOOK_OPTIONS = [
  'aiming-talk',
  'entrust',
  'random-target',
  'select-role',
  'seq-event',
  'undead-talk'
] as const

export const ROLETABLES = [
  'custom',
  'default',
  'hamster',
  'lover',
  'mistery',
  'random',
  'test1st',
  'test2nd',
  'ultimate',
  'wbbs_c',
  'wbbs_f',
  'wbbs_g'
] as const

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

export const KATAKANA = [
  'ア',
  'ィ',
  'イ',
  'ゥ',
  'ウ',
  'ェ',
  'エ',
  'ォ',
  'オ',
  'カ',
  'ガ',
  'キ',
  'ギ',
  'ク',
  'グ',
  'ケ',
  'ゲ',
  'コ',
  'ゴ',
  'サ',
  'ザ',
  'シ',
  'ジ',
  'ス',
  'ズ',
  'セ',
  'ゼ',
  'ソ',
  'ゾ',
  'タ',
  'ダ',
  'チ',
  'ヂ',
  'ッ',
  'ツ',
  'ヅ',
  'テ',
  'デ',
  'ト',
  'ド',
  'ナ',
  'ニ',
  'ヌ',
  'ネ',
  'ノ',
  'ハ',
  'バ',
  'パ',
  'ヒ',
  'ビ',
  'ピ',
  'フ',
  'ブ',
  'プ',
  'ヘ',
  'ベ',
  'ペ',
  'ホ',
  'ボ',
  'ポ',
  'マ',
  'ミ',
  'ム',
  'メ',
  'モ',
  'ャ',
  'ヤ',
  'ュ',
  'ユ',
  'ョ',
  'ヨ',
  'ラ',
  'リ',
  'ル',
  'レ',
  'ロ',
  'ヮ',
  'ワ',
  'ヰ',
  'ヱ',
  'ヲ',
  'ン'
] as const
