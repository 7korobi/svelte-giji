import { inPlaceSort } from './fast-sort';
export function sort(value) {
    if (!(value instanceof Array)) {
        const list = [];
        for (const id in value) {
            const item = value[id];
            item._id = id;
            list.push(item);
        }
        value = list;
    }
    return inPlaceSort(value);
}
export function group_sort(data, cb, ...cbs) {
    if (!cbs.length)
        return cb(data);
    if (data instanceof Array) {
        for (const o of data) {
            ;
            group_sort(o, ...cbs);
        }
    }
    else {
        const list = [];
        for (const idx in data) {
            const item = group_sort(data[idx], ...cbs);
            item._id = idx;
            list.push(item);
        }
        data = list;
    }
    return cb(data);
}
export function dic(o, ...levels) {
    for (let i = 0; i < levels.length; i += 2) {
        const id = levels[i];
        const format = levels[i + 1];
        if (!o[id])
            o[id] = format;
        o = o[id];
    }
    return o;
}
/*
type Head<T extends readonly unknown[] | string> = T extends string
  ? T extends `${infer F}${string}`
    ? F
    : T extends ''
    ? ''
    : string
  : T extends readonly [infer U, ...infer _]
  ? U
  : T[0] | undefined

type Tail<T extends string | readonly unknown[]> = T extends string
  ? T extends `${string}${infer R}`
    ? R
    : T extends ''
    ? ''
    : string
  : T extends readonly [unknown, ...infer R]
  ? R
  : T

type Head<T extends readonly unknown[]> = T extends readonly [infer U, ...infer _]
  ? U
  : T[0] | undefined

type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R]
  ? R
  : T
*/
