import type { SortCmd } from './fast-sort'
import { inPlaceSort } from './fast-sort'

export type DIC<T> = {
  [id: string]: T
}
export type ARY<T> = T[] & {
  _id: string
}

type SORT<T> = (data: T) => T
type SORT_DICT<T> = (data: DIC<T>) => (T & {_id: string})[]

export function sort<D>(value: D[]): SortCmd<D>
export function sort<D>(value: DIC<D>): SortCmd<D & {_id: string}>
export function sort<D>(value: D[] | DIC<D>) {
  if (!(value instanceof Array)) {
    const list = [] as D[]
    for (const id in value) {
      const item = value[id]
      ;(item as any)._id = id
      list.push(item)
    }
    value = list
  }
  return inPlaceSort(value)
}

export function group_sort<T>(data: DIC<DIC<DIC<DIC<T>>>>, cb5: SORT_DICT<ARY<ARY<ARY<T>>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<DIC<DIC<ARY<T>>>>, cb5: SORT_DICT<ARY<ARY<ARY<T>>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<DIC<ARY<DIC<T>>>>, cb5: SORT_DICT<ARY<ARY<ARY<T>>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<DIC<ARY<ARY<T>>>>, cb5: SORT_DICT<ARY<ARY<ARY<T>>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<ARY<DIC<DIC<T>>>>, cb5: SORT_DICT<ARY<ARY<ARY<T>>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<ARY<DIC<ARY<T>>>>, cb5: SORT_DICT<ARY<ARY<ARY<T>>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<ARY<ARY<DIC<T>>>>, cb5: SORT_DICT<ARY<ARY<ARY<T>>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<ARY<ARY<ARY<T>>>>, cb5: SORT_DICT<ARY<ARY<ARY<T>>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<DIC<DIC<DIC<T>>>>, cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<DIC<DIC<ARY<T>>>>, cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<DIC<ARY<DIC<T>>>>, cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<DIC<ARY<ARY<T>>>>, cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<ARY<DIC<DIC<T>>>>, cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<ARY<DIC<ARY<T>>>>, cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<ARY<ARY<DIC<T>>>>, cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<ARY<ARY<ARY<T>>>>, cb5: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<DIC<DIC<T>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: DIC<DIC<ARY<T>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: DIC<ARY<DIC<T>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: DIC<ARY<ARY<T>>>, cb4: SORT_DICT<ARY<ARY<T>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: ARY<DIC<DIC<T>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: ARY<DIC<ARY<T>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: ARY<ARY<DIC<T>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: ARY<ARY<ARY<T>>>, cb4: SORT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: DIC<DIC<T>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<T>>
export function group_sort<T>(data: DIC<ARY<T>>, cb3: SORT_DICT<ARY<T>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<T>>
export function group_sort<T>(data: ARY<DIC<T>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<ARY<T>>
export function group_sort<T>(data: ARY<ARY<T>>, cb3: SORT<ARY<ARY<T>>>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<ARY<T>>
export function group_sort<T>(data: DIC<T>, cb2: SORT_DICT<T>, cb1: SORT<T>): ARY<T>
export function group_sort<T>(data: ARY<T>, cb2: SORT<ARY<T>>, cb1: SORT<T>): ARY<T>
export function group_sort<T>(data: T, cb1: SORT<T>): T
export function group_sort<T>(data: DIC<DIC<DIC<DIC<T>>>>, cb4: SORT_DICT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<DIC<DIC<ARY<T>>>>, cb4: SORT_DICT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<DIC<ARY<DIC<T>>>>, cb4: SORT_DICT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<DIC<ARY<ARY<T>>>>, cb4: SORT_DICT<ARY<ARY<ARY<T>>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<ARY<DIC<DIC<T>>>>, cb4: SORT_DICT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<ARY<DIC<ARY<T>>>>, cb4: SORT_DICT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<ARY<ARY<DIC<T>>>>, cb4: SORT_DICT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<ARY<ARY<ARY<T>>>>, cb4: SORT_DICT<ARY<ARY<ARY<T>>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<DIC<DIC<DIC<T>>>>, cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<DIC<DIC<ARY<T>>>>, cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<DIC<ARY<DIC<T>>>>, cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<DIC<ARY<ARY<T>>>>, cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<ARY<DIC<DIC<T>>>>, cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<ARY<DIC<ARY<T>>>>, cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<ARY<ARY<DIC<T>>>>, cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: ARY<ARY<ARY<ARY<T>>>>, cb4: SORT<ARY<ARY<ARY<ARY<T>>>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<ARY<T>>>>
export function group_sort<T>(data: DIC<DIC<DIC<T>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: DIC<DIC<ARY<T>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: DIC<ARY<DIC<T>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: DIC<ARY<ARY<T>>>, cb3: SORT_DICT<ARY<ARY<T>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: ARY<DIC<DIC<T>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: ARY<DIC<ARY<T>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: ARY<ARY<DIC<T>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT_DICT<T>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: ARY<ARY<ARY<T>>>, cb3: SORT<ARY<ARY<ARY<T>>>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT<ARY<T>>): ARY<ARY<ARY<T>>>
export function group_sort<T>(data: DIC<DIC<T>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT_DICT<T>): ARY<ARY<T>>
export function group_sort<T>(data: DIC<ARY<T>>, cb2: SORT_DICT<ARY<T>>, cb1: SORT<ARY<T>>): ARY<ARY<T>>
export function group_sort<T>(data: ARY<DIC<T>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT_DICT<T>): ARY<ARY<T>>
export function group_sort<T>(data: ARY<ARY<T>>, cb2: SORT<ARY<ARY<T>>>, cb1: SORT<ARY<T>>): ARY<ARY<T>>
export function group_sort<T>(data: DIC<T>, cb1: SORT_DICT<T>): ARY<T>
export function group_sort<T>(data: ARY<T>, cb1: SORT<ARY<T>>): ARY<T>
export function group_sort(data: any, cb: any, ...cbs: any[]) {
  if (!cbs.length) return cb(data)

  if (data instanceof Array) {
    for (const o of data) {
      ;(group_sort as any)(o, ...cbs)
    }
  } else {
    const list = []
    for (const idx in data) {
      const item = (group_sort as any)(data[idx], ...cbs)
      item._id = idx
      list.push(item)
    }
    data = list
  }
  return cb(data)
}

type dic6<T, OUT> = [DIC<dic5<T, OUT>[0]>, string, ...dic5<T, OUT>] | [ARY<dic5<T, OUT>[0]>, number, ...dic5<T, OUT>]
type dic5<T, OUT> = [DIC<dic4<T, OUT>[0]>, string, ...dic4<T, OUT>] | [ARY<dic4<T, OUT>[0]>, number, ...dic4<T, OUT>]
type dic4<T, OUT> = [DIC<dic3<T, OUT>[0]>, string, ...dic3<T, OUT>] | [ARY<dic3<T, OUT>[0]>, number, ...dic3<T, OUT>]
type dic3<T, OUT> = [DIC<dic2<T, OUT>[0]>, string, ...dic2<T, OUT>] | [ARY<dic2<T, OUT>[0]>, number, ...dic2<T, OUT>]
type dic2<T, OUT> = [DIC<dic1<T, OUT>[0]>, string, ...dic1<T, OUT>] | [ARY<dic1<T, OUT>[0]>, number, ...dic1<T, OUT>]
type dic1<T, OUT> = [DIC<T>, string, OUT] | [ARY<T>, number, OUT]

export function dic<T extends any[]>(...args: dic1<T, []>): T
export function dic<T extends object>(...args: dic1<T, {}>): T
export function dic<T extends any[]>(...args: dic2<T, []>): T
export function dic<T extends object>(...args: dic2<T, {}>): T
export function dic<T extends any[]>(...args: dic3<T, []>): T
export function dic<T extends object>(...args: dic3<T, {}>): T
export function dic<T extends any[]>(...args: dic4<T, []>): T
export function dic<T extends object>(...args: dic4<T, {}>): T
export function dic<T extends any[]>(...args: dic5<T, []>): T
export function dic<T extends object>(...args: dic5<T, {}>): T
export function dic<T extends any[]>(...args: dic6<T, []>): T
export function dic<T extends object>(...args: dic6<T, {}>): T
export function dic<T>(o: any, ...levels: any): T {
  for (let i = 0; i < levels.length; i += 2) {
    const id = levels[i] as string | number
    const format = levels[i + 1] as {} | []
    if (!o[id]) o[id] = format
    o = o[id]
  }
  return o
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
