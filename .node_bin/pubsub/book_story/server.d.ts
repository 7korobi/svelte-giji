import type { BookStory } from '../map-reduce';
export declare const stories: {
    $match: (ids: `${string}-${number}`[]) => {
        _id: {
            $in: `${string}-${number}`[];
        };
    };
    set: ($set: BookStory) => Promise<import("mongodb").ModifyResult<BookStory>>;
    del: (ids: `${string}-${number}`[]) => Promise<import("mongodb").DeleteResult>;
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: BookStory) => Promise<import("mongodb").ModifyResult<BookStory>>, del: (ids: `${string}-${number}`[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<BookStory>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
};
export declare const story_summary: {
    $match(is_old: boolean): any;
    query($match: any): Promise<import("mongodb").Document[]>;
} | {
    $match(is_old: boolean): any;
    query($match: any): Promise<import("mongodb").Document[]>;
    isLive(is_old: boolean): Promise<boolean>;
    live($match: any, set: (docs: import("mongodb").Document[]) => void, del: (ids: any[]) => void): import("mongodb").ChangeStream<import("mongodb").Document>;
    set(doc: import("mongodb").Document): Promise<import("mongodb").ModifyResult<import("mongodb").Document>>;
    del(ids: any[]): Promise<import("mongodb").DeleteResult>;
};
