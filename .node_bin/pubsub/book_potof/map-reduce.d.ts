import type { ObjectId } from 'mongodb';
import type { AccountID, FaceID } from '../_type/id';
import type { presentation } from '../_type/string';
import type {
  BOOK_STORY_ID,
  BOOK_EVENT_ID,
  BOOK_EVENT_IDX,
  BookCardSelect,
  BookCardLive,
  BookCardRole,
  BookStat,
  ROLE_ID,
  CHR_SET_IDX
} from '../map-reduce';
export declare type BookPotof = {
  _id: ObjectId | BOOK_POTOF_ID;
  story_id: BOOK_STORY_ID;
  event_id: BOOK_EVENT_ID;
  face_id: FaceID;
  sow_auth_id: AccountID;
  job: string;
  csid: CHR_SET_IDX;
  clearance: number;
  zapcount: number;
  cards: [BookCardSelect, BookCardLive, ...BookCardRole[]];
  select?: ROLE_ID;
  live?: LiveType;
  deathday?: number;
  role?: ROLE_ID[];
  rolestate?: number;
  stats: BookStat[];
  stat_give: BookStat;
  point: {
    actaddpt: number;
    saidcount: number;
    saidpoint: number;
  };
  stat_said: BookStat;
  say: {
    gsay: number;
    say: number;
    say_act: number;
    tsay?: number;
    spsay?: number;
    wsay?: number;
    xsay?: number;
  };
  stat_commit: BookStat;
  commit?: boolean;
  overhear: BOOK_EVENT_IDX[];
  timer: {
    entrieddt: Date;
    limitentrydt: Date;
  };
  jobname?: presentation;
  history?: presentation;
};
export declare type BOOK_POTOF_ID = `${BOOK_STORY_ID}-${BOOK_POTOF_IDX}`;
export declare type BOOK_POTOF_IDX = `${number}`;
export declare type LiveType = 'mob' | 'live' | 'victim' | 'executed' | 'suddendead';
