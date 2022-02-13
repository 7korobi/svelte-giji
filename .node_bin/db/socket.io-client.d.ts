import type { Readable } from 'svelte/store';
import type { BaseF, BaseT, MapReduceProps, OrderUtils } from 'svelte-map-reduce-store';
declare type QueryProps<MatchArgs extends any[]> = {
  name?: string;
  qid: (...args: MatchArgs) => string;
};
declare type StoreQuery<F extends BaseF<BaseT<any>>, OrderArgs extends any[]> = Readable<F> & {
  find(id: F['list'][number]['_id']): F['list'][number];
  sort(...args: OrderArgs): void;
};
declare type StoreEntry<F extends BaseF<BaseT<any>>, OrderArgs extends any[], MatchArgs extends any[], Index> = QueryProps<MatchArgs> &
  MapReduceProps<F, OrderArgs, Index>;
export declare type BaseStoreEntry = StoreEntry<BaseF<BaseT<any>>, any[], any[], string | number | boolean | null>;
declare let STORE: {
  [name: string]: BaseStoreEntry;
};
export declare function model<F extends BaseF<BaseT<any>>, OrderArgs extends any[], MatchArgs extends any[], Index extends string>(
  props: StoreEntry<F, OrderArgs, MatchArgs, Index>
): {
  name?: string;
  qid: (...args: MatchArgs) => string;
  index?: (_id: F['list'][number]['_id']) => Index;
  format: () => F;
  reduce: (o: F, doc: F['list'][number]) => void;
  order: (o: F, { sort, group_sort }: typeof OrderUtils, ...args: OrderArgs) => void;
};
export declare function model<F extends BaseF<BaseT<any>>, OrderArgs extends any[], Index>(
  props: MapReduceProps<F, OrderArgs, Index>
): {
  index?: (_id: F['list'][number]['_id']) => Index;
  format: () => F;
  reduce: (o: F, doc: F['list'][number]) => void;
  order: (o: F, { sort, group_sort }: typeof OrderUtils, ...args: OrderArgs) => void;
};
export default function client(uri: string, stores: typeof STORE): void;
export declare function fcm(token: string, appends: string[], deletes: string[]): Promise<boolean>;
export declare function socket<F extends BaseF<any>, MatchArgs extends any[], OrderArgs extends any[], Index>({
  name,
  qid,
  index,
  format,
  order,
  reduce
}: StoreEntry<F, OrderArgs, MatchArgs, Index>): {
  query(...args: MatchArgs): StoreQuery<F, OrderArgs>;
  set?(docs: F['list'][number][]): void;
  del?(ids: F['list'][number]['_id'][]): void;
};
export {};
