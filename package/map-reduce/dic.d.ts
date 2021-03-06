import type { SortCmd } from './fast-sort';
export declare type DIC<T> = {
  [id: string]: T;
};
export declare type ARY<T> = T[] & {
  _id: string;
};
declare type SORT<T> = (data: T) => T;
declare type SORT_DICT<T> = (
  data: DIC<T>
) => (T & {
  _id: string;
})[];
export declare function sort<D>(value: D[]): SortCmd<D>;
export declare function sort<D>(
  value: DIC<D>
): SortCmd<
  D & {
    _id: string;
  }
>;
export declare function group_sort<T>(
  data: DIC<DIC<DIC<DIC<T>>>>,
  cb5: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<DIC<DIC<ARY<T>>>>,
  cb5: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<DIC<ARY<DIC<T>>>>,
  cb5: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<DIC<ARY<ARY<T>>>>,
  cb5: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<ARY<DIC<DIC<T>>>>,
  cb5: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<ARY<DIC<ARY<T>>>>,
  cb5: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<ARY<ARY<DIC<T>>>>,
  cb5: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<ARY<ARY<ARY<T>>>>,
  cb5: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<DIC<DIC<DIC<T>>>>,
  cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<DIC<DIC<ARY<T>>>>,
  cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<DIC<ARY<DIC<T>>>>,
  cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<DIC<ARY<ARY<T>>>>,
  cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<ARY<DIC<DIC<T>>>>,
  cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<ARY<DIC<ARY<T>>>>,
  cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<ARY<ARY<DIC<T>>>>,
  cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<ARY<ARY<ARY<T>>>>,
  cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<DIC<DIC<T>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: DIC<DIC<ARY<T>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: DIC<ARY<DIC<T>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: DIC<ARY<ARY<T>>>,
  cb4: SORT_DICT<ARY<ARY<T>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: ARY<DIC<DIC<T>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: ARY<DIC<ARY<T>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<T>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: ARY<ARY<DIC<T>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT_DICT<T>,
  cb1: SORT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: ARY<ARY<ARY<T>>>,
  cb4: SORT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<T>>>,
  cb2: SORT<ARY<T>>,
  cb1: SORT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(data: DIC<DIC<T>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<T>>;
export declare function group_sort<T>(data: DIC<ARY<T>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<T>>;
export declare function group_sort<T>(data: ARY<DIC<T>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<T>>;
export declare function group_sort<T>(data: ARY<ARY<T>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<T>>;
export declare function group_sort<T>(data: DIC<T>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<T>;
export declare function group_sort<T>(data: ARY<T>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<T>;
export declare function group_sort<T>(data: T, cb1: SORT<T>): T;
export declare function group_sort<T>(
  data: DIC<DIC<DIC<DIC<T>>>>,
  cb4: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<DIC<DIC<ARY<T>>>>,
  cb4: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<DIC<ARY<DIC<T>>>>,
  cb4: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<DIC<ARY<ARY<T>>>>,
  cb4: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<ARY<DIC<DIC<T>>>>,
  cb4: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<ARY<DIC<ARY<T>>>>,
  cb4: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<ARY<ARY<DIC<T>>>>,
  cb4: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<ARY<ARY<ARY<T>>>>,
  cb4: SORT_DICT<ARY<ARY<ARY<T>>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<DIC<DIC<DIC<T>>>>,
  cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<DIC<DIC<ARY<T>>>>,
  cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<DIC<ARY<DIC<T>>>>,
  cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<DIC<ARY<ARY<T>>>>,
  cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<ARY<DIC<DIC<T>>>>,
  cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<ARY<DIC<ARY<T>>>>,
  cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<ARY<ARY<DIC<T>>>>,
  cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: ARY<ARY<ARY<ARY<T>>>>,
  cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<ARY<T>>>>;
export declare function group_sort<T>(
  data: DIC<DIC<DIC<T>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: DIC<DIC<ARY<T>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: DIC<ARY<DIC<T>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: DIC<ARY<ARY<T>>>,
  cb3: SORT_DICT<ARY<ARY<T>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: ARY<DIC<DIC<T>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: ARY<DIC<ARY<T>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT_DICT<ARY<T>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: ARY<ARY<DIC<T>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT_DICT<T>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(
  data: ARY<ARY<ARY<T>>>,
  cb3: SORT<ARY<ARY<ARY<T>>>>,
  cb2: SORT<ARY<ARY<T>>>,
  cb1: SORT<ARY<T>>
): ARY<ARY<ARY<T>>>;
export declare function group_sort<T>(data: DIC<DIC<T>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT_DICT<T>): ARY<ARY<T>>;
export declare function group_sort<T>(data: DIC<ARY<T>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT<ARY<T>>): ARY<ARY<T>>;
export declare function group_sort<T>(data: ARY<DIC<T>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT_DICT<T>): ARY<ARY<T>>;
export declare function group_sort<T>(data: ARY<ARY<T>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT<ARY<T>>): ARY<ARY<T>>;
export declare function group_sort<T>(data: DIC<T>, cb1: SORT_DICT<T>): ARY<T>;
export declare function group_sort<T>(data: ARY<T>, cb1: SORT<ARY<T>>): ARY<T>;
declare type dic6<T, OUT> = [DIC<dic5<T, OUT>[0]>, string, ...dic5<T, OUT>] | [ARY<dic5<T, OUT>[0]>, number, ...dic5<T, OUT>];
declare type dic5<T, OUT> = [DIC<dic4<T, OUT>[0]>, string, ...dic4<T, OUT>] | [ARY<dic4<T, OUT>[0]>, number, ...dic4<T, OUT>];
declare type dic4<T, OUT> = [DIC<dic3<T, OUT>[0]>, string, ...dic3<T, OUT>] | [ARY<dic3<T, OUT>[0]>, number, ...dic3<T, OUT>];
declare type dic3<T, OUT> = [DIC<dic2<T, OUT>[0]>, string, ...dic2<T, OUT>] | [ARY<dic2<T, OUT>[0]>, number, ...dic2<T, OUT>];
declare type dic2<T, OUT> = [DIC<dic1<T, OUT>[0]>, string, ...dic1<T, OUT>] | [ARY<dic1<T, OUT>[0]>, number, ...dic1<T, OUT>];
declare type dic1<T, OUT> = [DIC<T>, string, OUT] | [ARY<T>, number, OUT];
export declare function dic<T extends any[]>(...args: dic1<T, []>): T;
export declare function dic<T extends object>(...args: dic1<T, {}>): T;
export declare function dic<T extends any[]>(...args: dic2<T, []>): T;
export declare function dic<T extends object>(...args: dic2<T, {}>): T;
export declare function dic<T extends any[]>(...args: dic3<T, []>): T;
export declare function dic<T extends object>(...args: dic3<T, {}>): T;
export declare function dic<T extends any[]>(...args: dic4<T, []>): T;
export declare function dic<T extends object>(...args: dic4<T, {}>): T;
export declare function dic<T extends any[]>(...args: dic5<T, []>): T;
export declare function dic<T extends object>(...args: dic5<T, {}>): T;
export declare function dic<T extends any[]>(...args: dic6<T, []>): T;
export declare function dic<T extends object>(...args: dic6<T, {}>): T;
export {};
