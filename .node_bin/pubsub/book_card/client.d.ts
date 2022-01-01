import type { BookCard } from '../map-reduce';
export declare const cards: {
    name?: string;
    qid: (ids: (`${string}-${number}-${number}-role` | `${string}-${number}-${number}-gift` | `${string}-${number}-${number}-live` | `${string}-${number}-${number}-request`)[]) => string;
    format: () => {
        list: BookCard[];
    };
    reduce: (o: {
        list: BookCard[];
    }, doc: BookCard) => void;
    order: (o: {
        list: BookCard[];
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
