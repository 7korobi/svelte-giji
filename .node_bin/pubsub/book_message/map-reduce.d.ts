import type { AccountID, FaceID } from '../_type/id';
import type { presentation } from '../_type/string';
import type {
  BOOK_STORY_IDX,
  BOOK_STORY_ID,
  BOOK_EVENT_IDX,
  BOOK_EVENT_ID,
  BookEvent,
  BookStory,
  BookPotof,
  BOOK_POTOF_ID,
  CHR_SET_IDX,
  Face
} from '../map-reduce';
export declare type BookMessage = {
  _id: BOOK_MESSAGE_ID;
  story_id: BOOK_STORY_ID;
  event_id: BOOK_EVENT_ID;
  sow_auth_id: AccountID;
  potof_id?: BOOK_POTOF_ID;
  face_id?: FaceID;
  mention_ids: BOOK_MESSAGE_ID[];
  phase: BookPhase;
  story: BookStory;
  event: BookEvent;
  potof?: BookPotof;
  face?: Face;
  write_at: Date;
  date?: string;
  show: CHAT;
  handle: HANDLE;
  mestype?: MesType;
  group: GroupType;
  subid?: SubType;
  logid?: `${BOOK_PHASE_IDX_BARE}-${BOOK_MESSAGE_IDX}`;
  csid?: CHR_SET_IDX;
  size?: number;
  deco: '' | 'head' | 'mono' | 'logo';
  style?: StyleType;
  name?: presentation;
  to?: presentation;
  log: presentation;
};
export declare type BookPhase = {
  _id: BOOK_PHASE_IDX;
  is_show: boolean;
  mark?: BOOK_PHASE_MARK;
  handle: HANDLE;
  label: presentation;
  text: presentation;
};
export declare type BOOK_PHASE_MARK = ' ' | '' | '#' | '%' | '@' | '-' | '+' | '=' | '*' | '!';
export declare type BOOK_PHASE_IDX_BARE = `${LogType}${SubType}` | 'MM' | 'AIM' | 'DEL';
export declare type BOOK_PHASE_IDX = keyof typeof phase_data;
export declare type BOOK_PHASE_ID = `${string}-${BOOK_STORY_IDX}-${BOOK_EVENT_IDX}-${LogType}${SubType}`;
export declare type BOOK_MESSAGE_IDX = `${number | 'cast' | 'vrule' | 'welcome' | 'title'}`;
export declare type BOOK_MESSAGE_ID =
  | `${string}-${BOOK_STORY_IDX}-${BOOK_EVENT_IDX}-${BOOK_PHASE_IDX}-${number}`
  | `${string}-${BOOK_STORY_IDX}-${BOOK_EVENT_IDX}-mS-cast`
  | `${string}-${BOOK_STORY_IDX}-top-mS-title`
  | `${string}-${BOOK_STORY_IDX}-top-mS-welcome`
  | `${string}-${BOOK_STORY_IDX}-top-mS-vrule`;
export declare type CHAT = typeof CHAT[number];
export declare type HANDLE = typeof HANDLE[number];
export declare type StyleType = typeof StyleType[number];
export declare type MesType = typeof MesType[number];
export declare type LogType = typeof LogType[number];
export declare type SubType = typeof SubType[number];
export declare type GroupType = typeof GroupType[number];
declare const phase_data: {
  readonly DEL: readonly [true, ' ', 'DEL', '-', '-'];
  readonly AIM: readonly [true, '-', 'AIM', '内緒', '内緒話'];
  readonly '-S': readonly [true, ' ', 'DEL', '-', '-'];
  readonly mS: readonly [true, '#', 'MAKER', '村建', '村建て発言'];
  readonly mA: readonly [true, ' ', 'MAKER', '村建', '村建てACT'];
  readonly aS: readonly [true, '%', 'ADMIN', '管理', '管理発言'];
  readonly aA: readonly [true, ' ', 'ADMIN', '管理', '管理ACT'];
  readonly cI: readonly [true, ' ', 'TITLE', '出演', '出演一覧'];
  readonly iI: readonly [true, ' ', 'private', '活動', '秘匿活動'];
  readonly II: readonly [true, ' ', 'public', '活動', '公開活動'];
  readonly DS: readonly [true, '', 'DEL', '削除', '削除発言'];
  readonly SS: readonly [true, '', 'SSAY', '会話', '通常の発言'];
  readonly SA: readonly [true, ' ', 'SSAY', '会話', '通常ACT'];
  readonly SB: readonly [true, ' ', 'SSAY', '会話', '通常の栞'];
  readonly SM: readonly [true, ' ', 'SSAY', '会話', '通常のメモ'];
  readonly VS: readonly [true, '@', 'VSSAY', '見物', '見物人発言'];
  readonly VA: readonly [true, ' ', 'VSSAY', '見物', '見物人のACT'];
  readonly VB: readonly [true, ' ', 'VSSAY', '見物', '見物人の栞'];
  readonly VM: readonly [true, ' ', 'VSSAY', '見物', '見物人のメモ'];
  readonly TS: readonly [true, '-', 'TSAY', '独言', '独り言'];
  readonly TA: readonly [true, ' ', 'TSAY', '栞', '栞'];
  readonly GS: readonly [true, '+', 'GSAY', '墓下', '墓下の発言'];
  readonly GA: readonly [true, ' ', 'GSAY', '墓下', '墓下のACT'];
  readonly GM: readonly [true, ' ', 'GSAY', '墓下', '墓下のメモ'];
  readonly PS: readonly [true, '=', 'PSAY', '共鳴', '共鳴の会話'];
  readonly PA: readonly [true, ' ', 'PSAY', '共鳴', '共鳴のACT'];
  readonly WS: readonly [true, '*', 'WSAY', '人狼', '人狼のささやき'];
  readonly WA: readonly [true, ' ', 'WSAY', '人狼', '人狼のACT'];
  readonly WM: readonly [true, ' ', 'WSAY', '人狼', '人狼のメモ'];
  readonly XS: readonly [true, '!', 'XSAY', '念波', '念話（念波の民）'];
  readonly XA: readonly [true, ' ', 'XSAY', '念波', '念act（念波の民）'];
  readonly BS: readonly [true, '!', 'XSAY', '念波', '念話（蝙蝠人間）'];
  readonly BA: readonly [true, ' ', 'XSAY', '念波', '念act（蝙蝠人間）'];
};
export declare const CHAT: readonly ['report', 'talk', 'post', 'logo', 'cast'];
export declare const HANDLE: readonly [
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
];
export declare const StyleType: readonly ['text', 'head', 'mono'];
export declare const MesType: readonly [
  'CAST',
  'ADMIN',
  'MAKER',
  'INFOSP',
  'INFONOM',
  'INFOWOLF',
  'AIM',
  'TSAY',
  'WSAY',
  'GSAY',
  'VSAY',
  'BSAY',
  'SPSAY',
  'SAY',
  'DELETED'
];
export declare const LogType: readonly ['c', 'a', 'm', 'i', 'I', 'D', 'S', 'V', 'G', 'T', 'W', 'P', 'X', 'B'];
export declare const SubType: readonly ['A', 'I', 'M', 'S', 'B'];
export declare const GroupType: readonly ['A', 'I', 'M', 'S'];
export declare const Phases: {
  deploy: (json: any, init?: (doc: BookPhase) => void) => void;
  clear: () => void;
  add: (docs: BookPhase[], init?: (doc: BookPhase) => void) => void;
  del: (
    ids: (
      | 'AIM'
      | 'DEL'
      | '-S'
      | 'mS'
      | 'mA'
      | 'aS'
      | 'aA'
      | 'cI'
      | 'iI'
      | 'II'
      | 'DS'
      | 'SS'
      | 'SA'
      | 'SB'
      | 'SM'
      | 'VS'
      | 'VA'
      | 'VB'
      | 'VM'
      | 'TS'
      | 'TA'
      | 'GS'
      | 'GA'
      | 'GM'
      | 'PS'
      | 'PA'
      | 'WS'
      | 'WA'
      | 'WM'
      | 'XS'
      | 'XA'
      | 'BS'
      | 'BA'
    )[]
  ) => void;
  find: (
    _id:
      | 'AIM'
      | 'DEL'
      | '-S'
      | 'mS'
      | 'mA'
      | 'aS'
      | 'aA'
      | 'cI'
      | 'iI'
      | 'II'
      | 'DS'
      | 'SS'
      | 'SA'
      | 'SB'
      | 'SM'
      | 'VS'
      | 'VA'
      | 'VB'
      | 'VM'
      | 'TS'
      | 'TA'
      | 'GS'
      | 'GA'
      | 'GM'
      | 'PS'
      | 'PA'
      | 'WS'
      | 'WA'
      | 'WM'
      | 'XS'
      | 'XA'
      | 'BS'
      | 'BA'
  ) => BookPhase;
  index: (
    _id:
      | 'AIM'
      | 'DEL'
      | '-S'
      | 'mS'
      | 'mA'
      | 'aS'
      | 'aA'
      | 'cI'
      | 'iI'
      | 'II'
      | 'DS'
      | 'SS'
      | 'SA'
      | 'SB'
      | 'SM'
      | 'VS'
      | 'VA'
      | 'VB'
      | 'VM'
      | 'TS'
      | 'TA'
      | 'GS'
      | 'GA'
      | 'GM'
      | 'PS'
      | 'PA'
      | 'WS'
      | 'WA'
      | 'WM'
      | 'XS'
      | 'XA'
      | 'BS'
      | 'BA'
  ) => unknown;
  reduce: <EMIT>(
    ids: (
      | 'AIM'
      | 'DEL'
      | '-S'
      | 'mS'
      | 'mA'
      | 'aS'
      | 'aA'
      | 'cI'
      | 'iI'
      | 'II'
      | 'DS'
      | 'SS'
      | 'SA'
      | 'SB'
      | 'SM'
      | 'VS'
      | 'VA'
      | 'VB'
      | 'VM'
      | 'TS'
      | 'TA'
      | 'GS'
      | 'GA'
      | 'GM'
      | 'PS'
      | 'PA'
      | 'WS'
      | 'WA'
      | 'WM'
      | 'XS'
      | 'XA'
      | 'BS'
      | 'BA'
    )[],
    emit: (o: EMIT) => void
  ) => import('svelte-map-reduce-store/fast-sort').SortCmd<BookPhase & EMIT>;
  filter: <A extends any[]>(
    validator: (o: BookPhase, ...args: A) => boolean,
    key?: string
  ) => (
    ...filter_args: A
  ) => {
    reduce: <EMIT_1>(
      ids: (
        | 'AIM'
        | 'DEL'
        | '-S'
        | 'mS'
        | 'mA'
        | 'aS'
        | 'aA'
        | 'cI'
        | 'iI'
        | 'II'
        | 'DS'
        | 'SS'
        | 'SA'
        | 'SB'
        | 'SM'
        | 'VS'
        | 'VA'
        | 'VB'
        | 'VM'
        | 'TS'
        | 'TA'
        | 'GS'
        | 'GA'
        | 'GM'
        | 'PS'
        | 'PA'
        | 'WS'
        | 'WA'
        | 'WM'
        | 'XS'
        | 'XA'
        | 'BS'
        | 'BA'
      )[],
      emit: (o: EMIT_1) => void
    ) => import('svelte-map-reduce-store/fast-sort').SortCmd<BookPhase & EMIT_1>;
    filter: any;
    sort: () => void;
    data: {
      list: BookPhase[];
    };
    subscribe: (
      this: void,
      run: import('svelte/store').Subscriber<{
        list: BookPhase[];
      }>,
      invalidate?: (value?: { list: BookPhase[] }) => void
    ) => import('svelte/store').Unsubscriber;
    validator: (o: BookPhase, ...args: A) => boolean;
  };
  sort: () => void;
  format: () => {
    list: BookPhase[];
  };
  data: {
    list: BookPhase[];
  };
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<{
      list: BookPhase[];
    }>,
    invalidate?: (value?: { list: BookPhase[] }) => void
  ) => import('svelte/store').Unsubscriber;
};
export {};
