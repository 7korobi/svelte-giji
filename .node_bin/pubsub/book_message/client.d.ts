import type { DIC } from '$lib/map-reduce';
import type { BookMessage } from '../map-reduce';
declare type EMIT = {
    max: Date;
    max_is: BookMessage;
    min: Date;
    min_is: BookMessage;
    count: number;
    all: number;
};
export declare const messages: {
    name?: string;
    qid: (ids: `${string}-${number}`[]) => string;
    format: () => {
        list: BookMessage[];
        event: DIC<BookMessage[]>;
        index: DIC<{
            max: number;
            max_is: BookMessage;
        }>;
        last: DIC<{
            max: Date;
            max_is: BookMessage;
        }>;
        say: EMIT;
        potof: DIC<DIC<EMIT>>;
        side: DIC<DIC<{
            max: Date;
            max_is: BookMessage;
        }>>;
        mention: DIC<{
            count: number;
        }>;
        mention_to: DIC<DIC<{
            count: number;
        }>>;
    };
    reduce: (o: {
        list: BookMessage[];
        event: DIC<BookMessage[]>;
        index: DIC<{
            max: number;
            max_is: BookMessage;
        }>;
        last: DIC<{
            max: Date;
            max_is: BookMessage;
        }>;
        say: EMIT;
        potof: DIC<DIC<EMIT>>;
        side: DIC<DIC<{
            max: Date;
            max_is: BookMessage;
        }>>;
        mention: DIC<{
            count: number;
        }>;
        mention_to: DIC<DIC<{
            count: number;
        }>>;
    }, doc: BookMessage) => void;
    order: (o: {
        list: BookMessage[];
        event: DIC<BookMessage[]>;
        index: DIC<{
            max: number;
            max_is: BookMessage;
        }>;
        last: DIC<{
            max: Date;
            max_is: BookMessage;
        }>;
        say: EMIT;
        potof: DIC<DIC<EMIT>>;
        side: DIC<DIC<{
            max: Date;
            max_is: BookMessage;
        }>>;
        mention: DIC<{
            count: number;
        }>;
        mention_to: DIC<DIC<{
            count: number;
        }>>;
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
export {};
