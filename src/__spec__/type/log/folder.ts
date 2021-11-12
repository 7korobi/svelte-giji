import type { CSID } from '$lib/pubsub/chr_set/map-reduce'
import type { SAYCNT, TRSID, GAME, VOTETYPES, BOOLS } from '$lib/pubsub/book_folder/map-reduce'

export type Folders = Folder[]
export type Folder = {
  nation: string
  folder: string
  vid_code: string
  server: string
  oldlog: string
  livelog: string
  info_url: string
  epi_url: string

  disabled: boolean
  hostname: string
  href: string
  max_vils: number
  rule: string
  title: string
  route: {
    path: string
    name: string
  }
  story: {
    evil: string
    role_play: boolean
  }
  config: {
    csid: CSID[]
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
