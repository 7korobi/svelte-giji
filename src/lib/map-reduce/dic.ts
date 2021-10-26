import { inPlaceSort } from './fast-sort'

export type DIC<T> = {
  [id: string]: T
}
type ARY<T> = T[]

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
  return inPlaceSort<D>(value)
}

type DA<T> = DIC<T> | T[]
export function group_sort<T>(data: DA<DA<T[]>>, cb3: (data: T[][][])=> T[][][], cb2: (data: T[][])=> T[][], cb1: (data: T[])=> T[]): T[][][]
export function group_sort<T>(data: DA<DA<{list: T[]}>>, cb3: (data: {list: T[]}[][])=> {list:T[]}[][], cb2: (data: { list: T[]}[])=> {list:T[]}[], cb1: (data: { list: T[]})=> {list:T[]}): {list:T[]}[][]
export function group_sort<T>(data: DA<DA<T[]>>, cb3: (data: T[][][])=> T[][][], cb2: (data: T[][])=> T[][], cb1: (data: T[])=> T[]): T[][][]
export function group_sort<T>(data: DA<{list: T[]}>, cb2: (data: { list: T[]}[])=> {list:T[]}[], cb1: (data: { list: T[]})=> {list:T[]}): {list:T[]}[]
export function group_sort<T>(data: DA<T[]>, cb2: (data: T[][])=> T[][], cb1: (data: T[])=> T[]): T[][]
export function group_sort<T>(data: {list: T[]}, cb1: (data: { list: T[]})=> {list:T[]}): {list:T[]}
export function group_sort<T>(data: T[], cb1: (data: T[])=> T[]): T[]
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

export function dic<T>(o1: DIC<DIC<DIC<DIC<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: DIC<DIC<DIC<DIC<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [] ): ARY<T>
export function dic<T>(o1: DIC<DIC<DIC<DIC<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: DIC<DIC<DIC<ARY<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: DIC<DIC<DIC<ARY<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [] ): ARY<T>
export function dic<T>(o1: DIC<DIC<DIC<ARY<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: DIC<DIC<ARY<DIC<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: DIC<DIC<ARY<DIC<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [] ): ARY<T>
export function dic<T>(o1: DIC<DIC<ARY<DIC<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: DIC<DIC<ARY<ARY<DIC<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: DIC<DIC<ARY<ARY<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [] ): ARY<T>
export function dic<T>(o1: DIC<DIC<ARY<ARY<ARY<T>>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: DIC<ARY<DIC<DIC<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: DIC<ARY<DIC<DIC<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [] ): ARY<T>
export function dic<T>(o1: DIC<ARY<DIC<DIC<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: DIC<ARY<DIC<ARY<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: DIC<ARY<DIC<ARY<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [] ): ARY<T>
export function dic<T>(o1: DIC<ARY<DIC<ARY<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: DIC<ARY<ARY<DIC<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: DIC<ARY<ARY<DIC<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [] ): ARY<T>
export function dic<T>(o1: DIC<ARY<ARY<DIC<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: DIC<ARY<ARY<ARY<DIC<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: DIC<ARY<ARY<ARY<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [] ): ARY<T>
export function dic<T>(o1: DIC<ARY<ARY<ARY<ARY<T>>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: ARY<DIC<DIC<DIC<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: ARY<DIC<DIC<DIC<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [] ): ARY<T>
export function dic<T>(o1: ARY<DIC<DIC<DIC<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: ARY<DIC<DIC<ARY<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: ARY<DIC<DIC<ARY<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [] ): ARY<T>
export function dic<T>(o1: ARY<DIC<DIC<ARY<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: ARY<DIC<ARY<DIC<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: ARY<DIC<ARY<DIC<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [] ): ARY<T>
export function dic<T>(o1: ARY<DIC<ARY<DIC<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: ARY<DIC<ARY<ARY<DIC<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: ARY<DIC<ARY<ARY<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [] ): ARY<T>
export function dic<T>(o1: ARY<DIC<ARY<ARY<ARY<T>>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: ARY<ARY<DIC<DIC<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: ARY<ARY<DIC<DIC<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [] ): ARY<T>
export function dic<T>(o1: ARY<ARY<DIC<DIC<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: ARY<ARY<DIC<ARY<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: ARY<ARY<DIC<ARY<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [] ): ARY<T>
export function dic<T>(o1: ARY<ARY<DIC<ARY<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: ARY<ARY<ARY<DIC<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: ARY<ARY<ARY<DIC<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [] ): ARY<T>
export function dic<T>(o1: ARY<ARY<ARY<DIC<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: [], id5: number, o6: {} ): T
export function dic<T>(o1: ARY<ARY<ARY<ARY<DIC<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {}, id5: string, o6: {} ): T
export function dic<T>(o1: ARY<ARY<ARY<ARY<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [] ): ARY<T>
export function dic<T>(o1: ARY<ARY<ARY<ARY<ARY<T>>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: [], id5: number, o6: {} ): T

export function dic<T>(o1: DIC<DIC<DIC<DIC<T>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {} ): T
export function dic<T>(o1: DIC<DIC<DIC<ARY<T>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [] ): ARY<T>
export function dic<T>(o1: DIC<DIC<DIC<ARY<T>>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {} ): T
export function dic<T>(o1: DIC<DIC<ARY<DIC<T>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {} ): T
export function dic<T>(o1: DIC<DIC<ARY<ARY<T>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [] ): ARY<T>
export function dic<T>(o1: DIC<DIC<ARY<ARY<T>>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {} ): T
export function dic<T>(o1: DIC<ARY<DIC<DIC<T>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {} ): T
export function dic<T>(o1: DIC<ARY<DIC<ARY<T>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [] ): ARY<T>
export function dic<T>(o1: DIC<ARY<DIC<ARY<T>>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {} ): T
export function dic<T>(o1: DIC<ARY<ARY<DIC<T>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {} ): T
export function dic<T>(o1: DIC<ARY<ARY<ARY<T>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [] ): ARY<T>
export function dic<T>(o1: DIC<ARY<ARY<ARY<T>>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {} ): T
export function dic<T>(o1: ARY<DIC<DIC<DIC<T>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {}, id4: string, o5: {} ): T
export function dic<T>(o1: ARY<DIC<DIC<ARY<T>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [] ): ARY<T>
export function dic<T>(o1: ARY<DIC<DIC<ARY<T>>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: [], id4: number, o5: {} ): T
export function dic<T>(o1: ARY<DIC<ARY<DIC<T>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {}, id4: string, o5: {} ): T
export function dic<T>(o1: ARY<DIC<ARY<ARY<T>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [] ): ARY<T>
export function dic<T>(o1: ARY<DIC<ARY<ARY<T>>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: [], id4: number, o5: {} ): T
export function dic<T>(o1: ARY<ARY<DIC<DIC<T>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {}, id4: string, o5: {} ): T
export function dic<T>(o1: ARY<ARY<DIC<ARY<T>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [] ): ARY<T>
export function dic<T>(o1: ARY<ARY<DIC<ARY<T>>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: [], id4: number, o5: {} ): T
export function dic<T>(o1: ARY<ARY<ARY<DIC<T>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {}, id4: string, o5: {} ): T
export function dic<T>(o1: ARY<ARY<ARY<ARY<T>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [] ): ARY<T>
export function dic<T>(o1: ARY<ARY<ARY<ARY<T>>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: [], id4: number, o5: {} ): T

export function dic<T>(o1: DIC<DIC<DIC<T>>>, id1: string, o2: {}, id2: string, o3: {}, id3: string, o4: {} ): T
export function dic<T>(o1: DIC<DIC<ARY<T>>>, id1: string, o2: {}, id2: string, o3: [] ): ARY<T>
export function dic<T>(o1: DIC<DIC<ARY<T>>>, id1: string, o2: {}, id2: string, o3: [], id3: number, o4: {} ): T
export function dic<T>(o1: DIC<ARY<DIC<T>>>, id1: string, o2: [], id2: number, o3: {}, id3: string, o4: {} ): T
export function dic<T>(o1: DIC<ARY<ARY<T>>>, id1: string, o2: [], id2: number, o3: [] ): ARY<T>
export function dic<T>(o1: DIC<ARY<ARY<T>>>, id1: string, o2: [], id2: number, o3: [], id3: number, o4: {} ): T
export function dic<T>(o1: ARY<DIC<DIC<T>>>, id1: number, o2: {}, id2: string, o3: {}, id3: string, o4: {} ): T
export function dic<T>(o1: ARY<DIC<ARY<T>>>, id1: number, o2: {}, id2: string, o3: [] ): ARY<T>
export function dic<T>(o1: ARY<DIC<ARY<T>>>, id1: number, o2: {}, id2: string, o3: [], id3: number, o4: {} ): T
export function dic<T>(o1: ARY<ARY<DIC<T>>>, id1: number, o2: [], id2: number, o3: {}, id3: string, o4: {} ): T
export function dic<T>(o1: ARY<ARY<ARY<T>>>, id1: number, o2: [], id2: number, o3: [] ): ARY<T>
export function dic<T>(o1: ARY<ARY<ARY<T>>>, id1: number, o2: [], id2: number, o3: [], id3: number, o4: {} ): T

export function dic<T>(o1: DIC<DIC<T>>, id1: string, o2: {}, id2: string, o3: {} ): T
export function dic<T>(o1: DIC<ARY<T>>, id1: string, o2: [] ): ARY<T>
export function dic<T>(o1: DIC<ARY<T>>, id1: string, o2: [], id2: number, o3: {} ): T
export function dic<T>(o1: ARY<DIC<T>>, id1: number, o2: {}, id2: string, o3: {} ): T
export function dic<T>(o1: ARY<ARY<T>>, id1: number, o2: [] ): ARY<T>
export function dic<T>(o1: ARY<ARY<T>>, id1: number, o2: [], id2: number, o3: {} ): T

export function dic<T>(o1: DIC<T>, id1: string, o2: {} ): T
export function dic<T>(o1: ARY<T>, id1: number, o2: {} ): T

export function dic<T>(o, ...levels: any): T {
  for (let i = 0; i < levels.length; i += 2) {
    const id = levels[i] as string | number
    const format = levels[i + 1] as {} | []
    if (!o[id]) o[id] = format
    o = o[id]
  }
  return o
}
