declare type IOrder = 1 | -1;
export interface IComparer {
    (a: any, b: any, order: IOrder): number;
}
export interface ISortInstanceOptions {
    comparer?: IComparer;
    inPlaceSorting?: boolean;
}
export interface ISortByFunction<T> {
    (prop: T): any;
}
export declare type ISortBy<T> = keyof T | ISortByFunction<T> | (keyof T | ISortByFunction<T>)[];
export interface ISortByAscSorter<T> extends ISortInstanceOptions {
    asc: boolean | ISortBy<T>;
}
export interface ISortByDescSorter<T> extends ISortInstanceOptions {
    desc: boolean | ISortBy<T>;
}
export declare type ISortByObjectSorter<T> = ISortByAscSorter<T> | ISortByDescSorter<T>;
export declare type SortCmd<T> = {
    asc(sortBy?: ISortBy<T> | ISortBy<T>[]): T[];
    desc(sortBy?: ISortBy<T> | ISortBy<T>[]): T[];
    by(sortBy: ISortByObjectSorter<T> | ISortByObjectSorter<T>[]): T[];
};
export declare const createNewSortInstance: (opts: ISortInstanceOptions) => <T>(_ctx: T[]) => SortCmd<T>;
export declare const sort: <T>(_ctx: T[]) => SortCmd<T>;
export declare const inPlaceSort: <T>(_ctx: T[]) => SortCmd<T>;
export {};
