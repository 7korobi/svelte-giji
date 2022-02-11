import type { BookEvent } from '../map-reduce';
export declare const events: {
  $match: (
    ids: (`${string}-${number}-${number}` | `${string}-${number}-top`)[]
  ) => {
    _id: {
      $in: (`${string}-${number}-${number}` | `${string}-${number}-top`)[];
    };
  };
  set: ($set: BookEvent) => Promise<import('mongodb').ModifyResult<BookEvent>>;
  del: (ids: (`${string}-${number}-${number}` | `${string}-${number}-top`)[]) => Promise<import('mongodb').DeleteResult>;
  isLive: () => Promise<boolean>;
  live: (
    $match: any,
    set: ($set: BookEvent) => Promise<import('mongodb').ModifyResult<BookEvent>>,
    del: (ids: (`${string}-${number}-${number}` | `${string}-${number}-top`)[]) => Promise<import('mongodb').DeleteResult>
  ) => import('mongodb').ChangeStream<BookEvent>;
  query: ($match: any) => Promise<import('mongodb').Document[]>;
};
