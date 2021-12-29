import type { BookEvent } from '../map-reduce';
export declare const events: {
    name?: string;
    qid: (ids: (`rp-${number}-${number}` | `rp-${number}-top` | `test-${number}-${number}` | `test-${number}-top` | `lobby-${number}-${number}` | `lobby-${number}-top` | `offparty-${number}-${number}` | `offparty-${number}-top` | `wolf-${number}-${number}` | `wolf-${number}-top` | `allstar-${number}-${number}` | `allstar-${number}-top` | `ultimate-${number}-${number}` | `ultimate-${number}-top` | `cabala-${number}-${number}` | `cabala-${number}-top` | `morphe-${number}-${number}` | `morphe-${number}-top` | `soybean-${number}-${number}` | `soybean-${number}-top` | `pretense-${number}-${number}` | `pretense-${number}-top` | `perjury-${number}-${number}` | `perjury-${number}-top` | `xebec-${number}-${number}` | `xebec-${number}-top` | `crazy-${number}-${number}` | `crazy-${number}-top` | `ciel-${number}-${number}` | `ciel-${number}-top` | `dais-${number}-${number}` | `dais-${number}-top`)[]) => string;
    format: () => {
        list: BookEvent[];
    };
    reduce: (o: {
        list: BookEvent[];
    }, doc: BookEvent) => void;
    order: (o: {
        list: BookEvent[];
    }, { sort, group_sort }: {
        sort: typeof import("../../map-reduce").sort;
        group_sort: typeof import("../../map-reduce").group_sort;
    }) => void;
};
