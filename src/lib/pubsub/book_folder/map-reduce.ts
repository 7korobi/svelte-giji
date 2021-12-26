import type { presentation, URL } from '../_type/string'
import type { CHR_SET_IDX } from '../map-reduce'

import { MapReduce } from '$lib/map-reduce'
import sow_json from '$lib/game/json/sow_folder.json'
import { __BROWSER__ } from '$lib/browser-device'

export type BookFolder = {
  _id: BOOK_FOLDER_IDX
  folder: BOOK_FOLDER
  nation: presentation
  vid_code: string

  server?: string
  oldlog?: string
  livelog?: string
  top_url?: URL
  info_url?: URL
  epi_url?: URL

  story?: {
    evil: 'EVIL' | 'WOLF'
    role_play: boolean
  }

  config?: {
    csid: CHR_SET_IDX[]
    saycnt: SAYCNT[]
    trsid: TRSID[]
    game: GAME[]
    pl: string
    erb: string
    cd_default: '戦' | '演'
    is_angular: boolean
    cfg: {
      BASEDIR_CGI: '.'
      BASEDIR_CGIERR: 'http://crazy-crazy.sakura.ne.jp//giji_lobby/lobby'
      BASEDIR_DAT: './data'
      BASEDIR_DOC: 'http://s3-ap-northeast-1.amazonaws.com/giji-assets'
      ENABLED_VMAKE: 0
      MAX_LOG: 750
      MAX_VILLAGES: 10
      NAME_HOME: '人狼議事 ロビー'
      RULE: 'LOBBY'
      TIMEOUT_ENTRY: 3
      TIMEOUT_SCRAP: 365
      TOPPAGE_INFO: './_info.pl'
      TYPE: 'BRAID'
      URL_SW: 'http://dais.kokage.cc/guide_lobby/lobby'
      USERID_ADMIN: 'master'
      USERID_NPC: 'master'
    }
    enable: {
      DEFAULT_VOTETYPE: [typeof VOTETYPES[number], '標準の投票方法(sign: 記名、anonymity:無記名)']
      ENABLED_AIMING: [BOOLS, '1:対象を指定した発言（内緒話）を含める']
      ENABLED_AMBIDEXTER: [
        BOOLS,
        '1:狂人の裏切りを認める（狂人は、人狼陣営ではなく裏切りの陣営＝村が負ければよい）'
      ]
      ENABLED_BITTY: [BOOLS, '少女や交霊者ののぞきみがひらがなのみ。']
      ENABLED_DELETED: [BOOLS, '削除発言を表示するかどうか']
      ENABLED_MAX_ESAY: [BOOLS, 'エピローグを発言制限対象に 0:しない、1:する']
      ENABLED_MOB_AIMING: [BOOLS, '1:見物人が内緒話を使える。']
      ENABLED_PERMIT_DEAD: [BOOLS, '墓下の人狼/共鳴者/コウモリ人間が囁きを見られるかどうか']
      ENABLED_RANDOMTARGET: [BOOLS, '1:投票・能力先に「ランダム」を含める']
      ENABLED_SEQ_EVENT: [BOOLS, '0:ランダムイベント 1:順序通りのイベント']
      ENABLED_SUDDENDEATH: [BOOLS, '1:突然死あり']
      ENABLED_SUICIDE_VOTE: [BOOLS, '1:自殺投票']
      ENABLED_UNDEAD: [BOOLS, '1:幽界トーク村を設定可能']
      ENABLED_WINNER_LABEL: [BOOLS, '1:勝利者表示をする。']
    }
    maxsize: {
      MAXSIZE_ACTION: number
      MAXSIZE_MEMOCNT: number
      MAXSIZE_MEMOLINE: number
    }
    path: {
      DIR_LIB: './lib'
      DIR_HTML: './html'
      DIR_RS: './rs'
      DIR_VIL: './data/vil'
      DIR_USER: '../data/user'
    }
  }
}

export type BOOLS = 0 | 1

export type BOOK_FOLDER_IDX = Lowercase<BOOK_FOLDER>
export type BOOK_FOLDER = typeof BOOK_FOLDER_IDX[number]
export type VOTETYPE = typeof VOTETYPES[number]
export type TRSID = typeof TRSIDS[number]
export type SAYCNT = typeof SAYCNTS[number]
export type GAME = typeof GAMES[number]

export const BOOK_FOLDER_IDX = [
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

export const VOTETYPES = ['anonymity', 'sign'] as const

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

export const GAMES = [
  'TABULA',
  'LIVE_TABULA',
  'MILLERHOLLOW',
  'LIVE_MILLERHOLLOW',
  'TROUBLE',
  'MISTERY',
  'SECRET'
] as const

export const Folders = MapReduce({
  format: () => ({
    list: [] as BookFolder[],
    sameSites: __BROWSER__ ? new Set([location.origin]) : new Set<string>()
  }),
  reduce: (data, doc) => {
    if (doc.server) data.sameSites.add(`http://${doc.server}`)
  },
  order: (data, { sort, group_sort }) => {}
})

for (const _id in sow_json) {
  const o = sow_json[_id]
  if (!o.nation) continue
  if (!o.folder) continue
  o._id = _id.toLowerCase()
  o.top_url = o.config?.cfg?.URL_SW + '/sow.cgi'
  Folders.add([o])
}
