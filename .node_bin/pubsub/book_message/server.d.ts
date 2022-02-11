import type { BOOK_STORY_ID, BookMessage } from '../map-reduce';
export declare const messages: {
  $match: (
    ids: import('./map-reduce').BOOK_MESSAGE_ID[]
  ) => {
    _id: {
      $in: import('./map-reduce').BOOK_MESSAGE_ID[];
    };
  };
  set: ($set: BookMessage) => Promise<import('mongodb').ModifyResult<BookMessage>>;
  del: (ids: import('./map-reduce').BOOK_MESSAGE_ID[]) => Promise<import('mongodb').DeleteResult>;
  isLive: () => Promise<boolean>;
  live: (
    $match: any,
    set: ($set: BookMessage) => Promise<import('mongodb').ModifyResult<BookMessage>>,
    del: (ids: import('./map-reduce').BOOK_MESSAGE_ID[]) => Promise<import('mongodb').DeleteResult>
  ) => import('mongodb').ChangeStream<BookMessage>;
  query: ($match: any) => Promise<import('mongodb').Document[]>;
};
export declare const message_oldlog: {
  $match: (
    story_id: BOOK_STORY_ID
  ) => {
    story_id: `${string}-${number}`;
  };
  set: ($set: BookMessage) => Promise<import('mongodb').ModifyResult<BookMessage>>;
  del: (ids: import('./map-reduce').BOOK_MESSAGE_ID[]) => Promise<import('mongodb').DeleteResult>;
  isLive: () => Promise<boolean>;
  live: (
    $match: any,
    set: ($set: BookMessage) => Promise<import('mongodb').ModifyResult<BookMessage>>,
    del: (ids: import('./map-reduce').BOOK_MESSAGE_ID[]) => Promise<import('mongodb').DeleteResult>
  ) => import('mongodb').ChangeStream<BookMessage>;
  query: ($match: any) => Promise<import('mongodb').Document[]>;
};
