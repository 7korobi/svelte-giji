import type { BOOK_STORY_ID, BookStat } from '../map-reduce';
export declare const stats: {
    $match: (ids: (`${string}-${number}-${number}` | `${string}-${number}-top` | `${string}-${number}-${number}-act` | `${string}-${number}-${number}-commit`)[]) => {
        _id: {
            $in: (`${string}-${number}-${number}` | `${string}-${number}-top` | `${string}-${number}-${number}-act` | `${string}-${number}-${number}-commit`)[];
        };
    };
    set: ($set: BookStat) => Promise<import("mongodb").ModifyResult<BookStat>>;
    del: (ids: (`${string}-${number}-${number}` | `${string}-${number}-top` | `${string}-${number}-${number}-act` | `${string}-${number}-${number}-commit`)[]) => Promise<import("mongodb").DeleteResult>;
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: BookStat) => Promise<import("mongodb").ModifyResult<BookStat>>, del: (ids: (`${string}-${number}-${number}` | `${string}-${number}-top` | `${string}-${number}-${number}-act` | `${string}-${number}-${number}-commit`)[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<BookStat>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
};
export declare const stat_oldlog: {
    $match: (story_id: BOOK_STORY_ID) => {
        story_id: `${string}-${number}`;
    };
    set: ($set: BookStat) => Promise<import("mongodb").ModifyResult<BookStat>>;
    del: (ids: (`${string}-${number}-${number}` | `${string}-${number}-top` | `${string}-${number}-${number}-act` | `${string}-${number}-${number}-commit`)[]) => Promise<import("mongodb").DeleteResult>;
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: BookStat) => Promise<import("mongodb").ModifyResult<BookStat>>, del: (ids: (`${string}-${number}-${number}` | `${string}-${number}-top` | `${string}-${number}-${number}-act` | `${string}-${number}-${number}-commit`)[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<BookStat>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
};
