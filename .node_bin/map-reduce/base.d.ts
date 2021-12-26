import type { SortCmd } from './fast-sort';
import * as dic from './dic';
export declare type BaseT<IdType> = {
    _id: IdType;
};
export declare type BaseF<T> = {
    list: T[];
};
export declare type MapReduceProps<F extends BaseF<any>, OrderArgs extends any[]> = {
    format: () => F;
    initialize?: (doc: F['list'][number]) => void;
    reduce: (o: F, doc: F['list'][number]) => void;
    order: (o: F, utils: typeof OrderUtils, ...args: OrderArgs) => void;
    start?: (set: (value: F) => void) => void | (() => void);
};
export declare const OrderUtils: {
    sort: typeof dic.sort;
    group_sort: typeof dic.group_sort;
};
declare type Validator<A extends any[], F extends BaseF<any>> = (o: F['list'][number], ...args: A) => boolean;
declare type LookupProps<F, OrderArgs extends any[]> = {
    format: () => F;
    subscribe: (set: (value: F) => void, lookup: LookupProps<F, OrderArgs>) => void;
    order: (o: F, { sort, group_sort }: typeof OrderUtils, ...args: OrderArgs) => void;
};
export declare function lookup<F, OrderArgs extends any[]>(o: LookupProps<F, OrderArgs>): {
    sort: (...sa: OrderArgs) => void;
    format: () => F;
    data: F;
    subscribe: (this: void, run: import("svelte/store").Subscriber<F>, invalidate?: (value?: F) => void) => import("svelte/store").Unsubscriber;
};
export declare function MapReduce<F extends BaseF<any>, OrderArgs extends any[]>({ format, initialize, reduce, order, start }: MapReduceProps<F, OrderArgs>): {
    deploy: (json: any, init?: (doc: F["list"][number]) => void) => void;
    clear: () => void;
    add: (docs: F['list'], init?: (doc: F["list"][number]) => void) => void;
    del: (ids: F['list'][number]['_id'][]) => void;
    find: (id: F['list'][number]['_id']) => F["list"][number];
    reduce: <EMIT>(ids: F['list'][number]['_id'][], emit: (o: EMIT) => void) => SortCmd<F["list"][number] & EMIT>;
    filter: <A extends any[]>(validator: Validator<A, F>, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: F['list'][number]['_id'][], emit: (o: EMIT) => void) => SortCmd<F["list"][number] & EMIT>;
        filter: any;
        sort: (...sa: OrderArgs) => void;
        data: F;
        subscribe: (this: void, run: import("svelte/store").Subscriber<F>, invalidate?: (value?: F) => void) => import("svelte/store").Unsubscriber;
        validator: Validator<A, F>;
    };
    sort: (...sa: OrderArgs) => void;
    format: () => F;
    data: F;
    subscribe: (this: void, run: import("svelte/store").Subscriber<F>, invalidate?: (value?: F) => void) => import("svelte/store").Unsubscriber;
};
export {};
