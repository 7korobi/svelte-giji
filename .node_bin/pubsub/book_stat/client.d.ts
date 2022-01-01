import type { BookStat } from '../map-reduce';
export declare const stats: {
    name?: string;
    qid: (ids: `${string}-${number}-${number}-give`[]) => string;
    format: () => {
        list: BookStat[];
    };
    reduce: (o: {
        list: BookStat[];
    }, doc: BookStat) => void;
    order: (o: {
        list: BookStat[];
    }, { sort, group_sort }: {
        sort: typeof import("../../map-reduce").sort;
        group_sort: typeof import("../../map-reduce").group_sort;
    }) => void;
};
