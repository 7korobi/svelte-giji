import type { presentation, URL } from '../_type/string';
import type { CHR_SET_IDX } from '../map-reduce';
export declare type BookFolder = {
    _id: BOOK_FOLDER_IDX;
    folder: BOOK_FOLDER;
    nation: presentation;
    vid_code: string;
    server?: string;
    oldlog?: string;
    livelog?: string;
    top_url?: URL;
    info_url?: URL;
    epi_url?: URL;
    story?: {
        evil: 'EVIL' | 'WOLF';
        role_play: boolean;
    };
    config?: {
        csid: CHR_SET_IDX[];
        saycnt: SAYCNT[];
        trsid: TRSID[];
        game: GAME[];
        pl: string;
        erb: string;
        cd_default: '戦' | '演';
        is_angular: boolean;
        cfg: {
            BASEDIR_CGI: '.';
            BASEDIR_CGIERR: 'http://crazy-crazy.sakura.ne.jp//giji_lobby/lobby';
            BASEDIR_DAT: './data';
            BASEDIR_DOC: 'http://s3-ap-northeast-1.amazonaws.com/giji-assets';
            ENABLED_VMAKE: 0;
            MAX_LOG: 750;
            MAX_VILLAGES: 10;
            NAME_HOME: '人狼議事 ロビー';
            RULE: 'LOBBY';
            TIMEOUT_ENTRY: 3;
            TIMEOUT_SCRAP: 365;
            TOPPAGE_INFO: './_info.pl';
            TYPE: 'BRAID';
            URL_SW: 'http://dais.kokage.cc/guide_lobby/lobby';
            USERID_ADMIN: 'master';
            USERID_NPC: 'master';
        };
        enable: {
            DEFAULT_VOTETYPE: [typeof VOTETYPES[number], '標準の投票方法(sign: 記名、anonymity:無記名)'];
            ENABLED_AIMING: [BOOLS, '1:対象を指定した発言（内緒話）を含める'];
            ENABLED_AMBIDEXTER: [
                BOOLS,
                '1:狂人の裏切りを認める（狂人は、人狼陣営ではなく裏切りの陣営＝村が負ければよい）'
            ];
            ENABLED_BITTY: [BOOLS, '少女や交霊者ののぞきみがひらがなのみ。'];
            ENABLED_DELETED: [BOOLS, '削除発言を表示するかどうか'];
            ENABLED_MAX_ESAY: [BOOLS, 'エピローグを発言制限対象に 0:しない、1:する'];
            ENABLED_MOB_AIMING: [BOOLS, '1:見物人が内緒話を使える。'];
            ENABLED_PERMIT_DEAD: [BOOLS, '墓下の人狼/共鳴者/コウモリ人間が囁きを見られるかどうか'];
            ENABLED_RANDOMTARGET: [BOOLS, '1:投票・能力先に「ランダム」を含める'];
            ENABLED_SEQ_EVENT: [BOOLS, '0:ランダムイベント 1:順序通りのイベント'];
            ENABLED_SUDDENDEATH: [BOOLS, '1:突然死あり'];
            ENABLED_SUICIDE_VOTE: [BOOLS, '1:自殺投票'];
            ENABLED_UNDEAD: [BOOLS, '1:幽界トーク村を設定可能'];
            ENABLED_WINNER_LABEL: [BOOLS, '1:勝利者表示をする。'];
        };
        maxsize: {
            MAXSIZE_ACTION: number;
            MAXSIZE_MEMOCNT: number;
            MAXSIZE_MEMOLINE: number;
        };
        path: {
            DIR_LIB: './lib';
            DIR_HTML: './html';
            DIR_RS: './rs';
            DIR_VIL: './data/vil';
            DIR_USER: '../data/user';
        };
    };
};
export declare type BOOLS = 0 | 1;
export declare type BOOK_FOLDER_IDX = Lowercase<BOOK_FOLDER>;
export declare type BOOK_FOLDER = typeof BOOK_FOLDER_IDX[number];
export declare type VOTETYPE = typeof VOTETYPES[number];
export declare type TRSID = typeof TRSIDS[number];
export declare type SAYCNT = typeof SAYCNTS[number];
export declare type GAME = typeof GAMES[number];
export declare const BOOK_FOLDER_IDX: readonly ["TEST", "LOBBY", "OFFPARTY", "WOLF", "ALLSTAR", "ULTIMATE", "CABALA", "MORPHE", "SOYBEAN", "RP", "PRETENSE", "PERJURY", "XEBEC", "CRAZY", "CIEL", "DAIS"];
export declare const VOTETYPES: readonly ["anonymity", "sign"];
export declare const TRSIDS: readonly ["sow", "all", "star", "regend", "heavy", "complexx", "tabula", "millerhollow", "ultimate"];
export declare const SAYCNTS: readonly ["lobby", "say5", "tiny", "weak", "vulcan", "infinity", "wbbs", "euro", "juna", "sow"];
export declare const GAMES: readonly ["TABULA", "LIVE_TABULA", "MILLERHOLLOW", "LIVE_MILLERHOLLOW", "TROUBLE", "MISTERY", "SECRET"];
export declare const Folders: {
    deploy: (json: any, init?: (doc: BookFolder) => void) => void;
    clear: () => void;
    add: (docs: BookFolder[], init?: (doc: BookFolder) => void) => void;
    del: (ids: ("wolf" | "ultimate" | "cabala" | "allstar" | "pretense" | "rp" | "morphe" | "soybean" | "ciel" | "perjury" | "xebec" | "dais" | "crazy" | "lobby" | "offparty" | "test")[]) => void;
    find: (_id: "wolf" | "ultimate" | "cabala" | "allstar" | "pretense" | "rp" | "morphe" | "soybean" | "ciel" | "perjury" | "xebec" | "dais" | "crazy" | "lobby" | "offparty" | "test") => BookFolder;
    index: (_id: "wolf" | "ultimate" | "cabala" | "allstar" | "pretense" | "rp" | "morphe" | "soybean" | "ciel" | "perjury" | "xebec" | "dais" | "crazy" | "lobby" | "offparty" | "test") => string | number | boolean;
    reduce: <EMIT>(ids: ("wolf" | "ultimate" | "cabala" | "allstar" | "pretense" | "rp" | "morphe" | "soybean" | "ciel" | "perjury" | "xebec" | "dais" | "crazy" | "lobby" | "offparty" | "test")[], emit: (o: EMIT) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<BookFolder & EMIT>;
    filter: <A extends any[]>(validator: (o: BookFolder, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT_1>(ids: ("wolf" | "ultimate" | "cabala" | "allstar" | "pretense" | "rp" | "morphe" | "soybean" | "ciel" | "perjury" | "xebec" | "dais" | "crazy" | "lobby" | "offparty" | "test")[], emit: (o: EMIT_1) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<BookFolder & EMIT_1>;
        filter: any;
        sort: (...sa: any[]) => void;
        data: {
            list: BookFolder[];
            sameSites: Set<string>;
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: BookFolder[];
            sameSites: Set<string>;
        }>, invalidate?: (value?: {
            list: BookFolder[];
            sameSites: Set<string>;
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: BookFolder, ...args: A) => boolean;
    };
    sort: (...sa: any[]) => void;
    format: () => {
        list: BookFolder[];
        sameSites: Set<string>;
    };
    data: {
        list: BookFolder[];
        sameSites: Set<string>;
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: BookFolder[];
        sameSites: Set<string>;
    }>, invalidate?: (value?: {
        list: BookFolder[];
        sameSites: Set<string>;
    }) => void) => import("svelte/store").Unsubscriber;
};
