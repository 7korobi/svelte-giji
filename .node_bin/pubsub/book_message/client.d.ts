import type { DIC } from '$lib/map-reduce';
import type { BookMessage } from '../map-reduce';
export declare const messages: {
    name?: string;
    qid: (ids: (`rp-${number}` | `test-${number}` | `lobby-${number}` | `offparty-${number}` | `wolf-${number}` | `allstar-${number}` | `ultimate-${number}` | `cabala-${number}` | `morphe-${number}` | `soybean-${number}` | `pretense-${number}` | `perjury-${number}` | `xebec-${number}` | `crazy-${number}` | `ciel-${number}` | `dais-${number}`)[]) => string;
    format: () => {
        list: BookMessage[];
        event: DIC<BookMessage[]>;
    };
    reduce: (o: {
        list: BookMessage[];
        event: DIC<BookMessage[]>;
    }, doc: BookMessage) => void;
    order: (o: {
        list: BookMessage[];
        event: DIC<BookMessage[]>;
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
