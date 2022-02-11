import type { BOOK_STORY_ID, BookCard } from '../map-reduce';
export declare const cards: {
  $match: (
    ids: (
      | `${string}-${number}-${number}-role`
      | `${string}-${number}-${number}-gift`
      | `${string}-${number}-${number}-select`
      | `${string}-${number}-${number}-live`
    )[]
  ) => {
    _id: {
      $in: (
        | `${string}-${number}-${number}-role`
        | `${string}-${number}-${number}-gift`
        | `${string}-${number}-${number}-select`
        | `${string}-${number}-${number}-live`
      )[];
    };
  };
  set: ($set: BookCard) => Promise<import('mongodb').ModifyResult<BookCard>>;
  del: (
    ids: (
      | `${string}-${number}-${number}-role`
      | `${string}-${number}-${number}-gift`
      | `${string}-${number}-${number}-select`
      | `${string}-${number}-${number}-live`
    )[]
  ) => Promise<import('mongodb').DeleteResult>;
  isLive: () => Promise<boolean>;
  live: (
    $match: any,
    set: ($set: BookCard) => Promise<import('mongodb').ModifyResult<BookCard>>,
    del: (
      ids: (
        | `${string}-${number}-${number}-role`
        | `${string}-${number}-${number}-gift`
        | `${string}-${number}-${number}-select`
        | `${string}-${number}-${number}-live`
      )[]
    ) => Promise<import('mongodb').DeleteResult>
  ) => import('mongodb').ChangeStream<BookCard>;
  query: ($match: any) => Promise<import('mongodb').Document[]>;
};
export declare const card_oldlog: {
  $match: (
    story_id: BOOK_STORY_ID
  ) => {
    story_id: `${string}-${number}`;
  };
  set: ($set: BookCard) => Promise<import('mongodb').ModifyResult<BookCard>>;
  del: (
    ids: (
      | `${string}-${number}-${number}-role`
      | `${string}-${number}-${number}-gift`
      | `${string}-${number}-${number}-select`
      | `${string}-${number}-${number}-live`
    )[]
  ) => Promise<import('mongodb').DeleteResult>;
  isLive: () => Promise<boolean>;
  live: (
    $match: any,
    set: ($set: BookCard) => Promise<import('mongodb').ModifyResult<BookCard>>,
    del: (
      ids: (
        | `${string}-${number}-${number}-role`
        | `${string}-${number}-${number}-gift`
        | `${string}-${number}-${number}-select`
        | `${string}-${number}-${number}-live`
      )[]
    ) => Promise<import('mongodb').DeleteResult>
  ) => import('mongodb').ChangeStream<BookCard>;
  query: ($match: any) => Promise<import('mongodb').Document[]>;
};
