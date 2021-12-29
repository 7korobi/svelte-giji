import type { BookStat } from '../map-reduce';
export declare const stats: {
    name?: string;
    qid: (ids: (`rp-${number}-${number}-give` | `test-${number}-${number}-give` | `lobby-${number}-${number}-give` | `offparty-${number}-${number}-give` | `wolf-${number}-${number}-give` | `allstar-${number}-${number}-give` | `ultimate-${number}-${number}-give` | `cabala-${number}-${number}-give` | `morphe-${number}-${number}-give` | `soybean-${number}-${number}-give` | `pretense-${number}-${number}-give` | `perjury-${number}-${number}-give` | `xebec-${number}-${number}-give` | `crazy-${number}-${number}-give` | `ciel-${number}-${number}-give` | `dais-${number}-${number}-give`)[]) => string;
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
