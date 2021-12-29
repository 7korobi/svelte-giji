import type { BookCard } from '../map-reduce';
export declare const cards: {
    name?: string;
    qid: (ids: (`rp-${number}-${number}-role` | `rp-${number}-${number}-gift` | `test-${number}-${number}-role` | `test-${number}-${number}-gift` | `lobby-${number}-${number}-role` | `lobby-${number}-${number}-gift` | `offparty-${number}-${number}-role` | `offparty-${number}-${number}-gift` | `wolf-${number}-${number}-role` | `wolf-${number}-${number}-gift` | `allstar-${number}-${number}-role` | `allstar-${number}-${number}-gift` | `ultimate-${number}-${number}-role` | `ultimate-${number}-${number}-gift` | `cabala-${number}-${number}-role` | `cabala-${number}-${number}-gift` | `morphe-${number}-${number}-role` | `morphe-${number}-${number}-gift` | `soybean-${number}-${number}-role` | `soybean-${number}-${number}-gift` | `pretense-${number}-${number}-role` | `pretense-${number}-${number}-gift` | `perjury-${number}-${number}-role` | `perjury-${number}-${number}-gift` | `xebec-${number}-${number}-role` | `xebec-${number}-${number}-gift` | `crazy-${number}-${number}-role` | `crazy-${number}-${number}-gift` | `ciel-${number}-${number}-role` | `ciel-${number}-${number}-gift` | `dais-${number}-${number}-role` | `dais-${number}-${number}-gift` | `rp-${number}-${number}-request` | `test-${number}-${number}-request` | `lobby-${number}-${number}-request` | `offparty-${number}-${number}-request` | `wolf-${number}-${number}-request` | `allstar-${number}-${number}-request` | `ultimate-${number}-${number}-request` | `cabala-${number}-${number}-request` | `morphe-${number}-${number}-request` | `soybean-${number}-${number}-request` | `pretense-${number}-${number}-request` | `perjury-${number}-${number}-request` | `xebec-${number}-${number}-request` | `crazy-${number}-${number}-request` | `ciel-${number}-${number}-request` | `dais-${number}-${number}-request` | `rp-${number}-${number}-live` | `test-${number}-${number}-live` | `lobby-${number}-${number}-live` | `offparty-${number}-${number}-live` | `wolf-${number}-${number}-live` | `allstar-${number}-${number}-live` | `ultimate-${number}-${number}-live` | `cabala-${number}-${number}-live` | `morphe-${number}-${number}-live` | `soybean-${number}-${number}-live` | `pretense-${number}-${number}-live` | `perjury-${number}-${number}-live` | `xebec-${number}-${number}-live` | `crazy-${number}-${number}-live` | `ciel-${number}-${number}-live` | `dais-${number}-${number}-live`)[]) => string;
    format: () => {
        list: BookCard[];
    };
    reduce: (o: {
        list: BookCard[];
    }, doc: BookCard) => void;
    order: (o: {
        list: BookCard[];
    }, { sort, group_sort }: {
        sort: typeof import("../../map-reduce").sort;
        group_sort: typeof import("../../map-reduce").group_sort;
    }) => void;
};
