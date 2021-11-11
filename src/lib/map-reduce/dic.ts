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
export function group_sort(data, cb, ...cbs) {
  if (cbs.length) {
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
  }
  return cb(data)
}

export function dic<T extends any[]>(o1: DIC<DIC<DIC<DIC<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<DIC<DIC<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<DIC<ARY<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<DIC<ARY<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<ARY<DIC<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<ARY<DIC<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<ARY<ARY<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<ARY<ARY<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<DIC<DIC<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<DIC<DIC<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<DIC<ARY<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<DIC<ARY<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<ARY<DIC<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<ARY<DIC<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<ARY<ARY<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<ARY<ARY<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<DIC<DIC<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<DIC<DIC<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<DIC<ARY<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<DIC<ARY<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<ARY<DIC<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<ARY<DIC<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<ARY<ARY<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<ARY<ARY<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<DIC<DIC<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<DIC<DIC<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<DIC<ARY<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<DIC<ARY<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<ARY<DIC<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<ARY<DIC<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<ARY<ARY<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<ARY<ARY<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: [] ): T

export function dic<T extends any[]>(o1: DIC<DIC<DIC<DIC<T>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<DIC<ARY<T>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<ARY<DIC<T>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<ARY<ARY<T>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<DIC<DIC<T>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<DIC<ARY<T>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<ARY<DIC<T>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<ARY<ARY<T>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<DIC<DIC<T>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<DIC<ARY<T>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<ARY<DIC<T>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<ARY<ARY<T>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<DIC<DIC<T>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<DIC<ARY<T>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<ARY<DIC<T>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<ARY<ARY<T>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [] ): T

export function dic<T extends any[]>(o1: DIC<DIC<DIC<T>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [] ): T
export function dic<T extends any[]>(o1: DIC<DIC<ARY<T>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<DIC<T>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<ARY<T>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<DIC<T>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<ARY<T>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<DIC<T>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<ARY<T>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [] ): T

export function dic<T extends any[]>(o1: DIC<DIC<T>>, id1: string, o2: {}, id2: string, o3: [] ): T
export function dic<T extends any[]>(o1: DIC<ARY<T>>, id1: string, o2: [], id2: number, o3: [] ): T
export function dic<T extends any[]>(o1: ARY<DIC<T>>, id1: number, o2: {}, id2: string, o3: [] ): T
export function dic<T extends any[]>(o1: ARY<ARY<T>>, id1: number, o2: [], id2: number, o3: [] ): T

export function dic<T extends any[]>(o1: DIC<T>, id1: string, o2: [] ): T
export function dic<T extends any[]>(o1: ARY<T>, id1: number, o2: [] ): T

export function dic<T extends object>(o1: DIC<DIC<DIC<DIC<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: DIC<DIC<DIC<DIC<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: DIC<DIC<DIC<ARY<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: DIC<DIC<DIC<ARY<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: DIC<DIC<ARY<DIC<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: DIC<DIC<ARY<DIC<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: DIC<DIC<ARY<ARY<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: DIC<DIC<ARY<ARY<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: DIC<ARY<DIC<DIC<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: DIC<ARY<DIC<DIC<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: DIC<ARY<DIC<ARY<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: DIC<ARY<DIC<ARY<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: DIC<ARY<ARY<DIC<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: DIC<ARY<ARY<DIC<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: DIC<ARY<ARY<ARY<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: DIC<ARY<ARY<ARY<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: ARY<DIC<DIC<DIC<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: ARY<DIC<DIC<DIC<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: ARY<DIC<DIC<ARY<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: ARY<DIC<DIC<ARY<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: ARY<DIC<ARY<DIC<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: ARY<DIC<ARY<DIC<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: ARY<DIC<ARY<ARY<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: ARY<DIC<ARY<ARY<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: ARY<ARY<DIC<DIC<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: ARY<ARY<DIC<DIC<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: ARY<ARY<DIC<ARY<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: ARY<ARY<DIC<ARY<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: ARY<ARY<ARY<DIC<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: ARY<ARY<ARY<DIC<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T extends object>(o1: ARY<ARY<ARY<ARY<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T extends object>(o1: ARY<ARY<ARY<ARY<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: {} ): T

export function dic<T extends object>(o1: DIC<DIC<DIC<DIC<T>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {} ): T
export function dic<T extends object>(o1: DIC<DIC<DIC<ARY<T>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {} ): T
export function dic<T extends object>(o1: DIC<DIC<ARY<DIC<T>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {} ): T
export function dic<T extends object>(o1: DIC<DIC<ARY<ARY<T>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {} ): T
export function dic<T extends object>(o1: DIC<ARY<DIC<DIC<T>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {} ): T
export function dic<T extends object>(o1: DIC<ARY<DIC<ARY<T>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {} ): T
export function dic<T extends object>(o1: DIC<ARY<ARY<DIC<T>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {} ): T
export function dic<T extends object>(o1: DIC<ARY<ARY<ARY<T>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {} ): T
export function dic<T extends object>(o1: ARY<DIC<DIC<DIC<T>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {} ): T
export function dic<T extends object>(o1: ARY<DIC<DIC<ARY<T>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {} ): T
export function dic<T extends object>(o1: ARY<DIC<ARY<DIC<T>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {} ): T
export function dic<T extends object>(o1: ARY<DIC<ARY<ARY<T>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {} ): T
export function dic<T extends object>(o1: ARY<ARY<DIC<DIC<T>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {} ): T
export function dic<T extends object>(o1: ARY<ARY<DIC<ARY<T>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {} ): T
export function dic<T extends object>(o1: ARY<ARY<ARY<DIC<T>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {} ): T
export function dic<T extends object>(o1: ARY<ARY<ARY<ARY<T>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {} ): T

export function dic<T extends object>(o1: DIC<DIC<DIC<T>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {} ): T
export function dic<T extends object>(o1: DIC<DIC<ARY<T>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {} ): T
export function dic<T extends object>(o1: DIC<ARY<DIC<T>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {} ): T
export function dic<T extends object>(o1: DIC<ARY<ARY<T>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {} ): T
export function dic<T extends object>(o1: ARY<DIC<DIC<T>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {} ): T
export function dic<T extends object>(o1: ARY<DIC<ARY<T>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {} ): T
export function dic<T extends object>(o1: ARY<ARY<DIC<T>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {} ): T
export function dic<T extends object>(o1: ARY<ARY<ARY<T>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {} ): T

export function dic<T extends object>(o1: DIC<DIC<T>>, id1: string, o2: {}, id2: string, o3: {} ): T
export function dic<T extends object>(o1: DIC<ARY<T>>, id1: string, o2: [], id2: number, o3: {} ): T
export function dic<T extends object>(o1: ARY<DIC<T>>, id1: number, o2: {}, id2: string, o3: {} ): T
export function dic<T extends object>(o1: ARY<ARY<T>>, id1: number, o2: [], id2: number, o3: {} ): T

export function dic<T extends object>(o1: DIC<T>, id1: string, o2: {} ): T
export function dic<T extends object>(o1: ARY<T>, id1: number, o2: {} ): T

export function dic<T>(o, ...levels: any): T {
  for (let i = 0; i < levels.length; i += 2) {
    const id = levels[i] as string | number
    const format = levels[i + 1] as {} | []
    if (!o[id]) o[id] = format
    o = o[id]
  }
  return o
}
