import { inPlaceSort } from './fast-sort'

export type BaseT<IdType> = {
  _id: IdType
}

export type BaseF<T> = {
  list: T[]
}

export type MapReduceProps<T, F> = {
  format: () => F
  order: (o: F, option: { sort: typeof sort }) => void
  reduce: (o: F, doc: T) => void
}

function sort<D>(value: D[] | DIC<D>) {
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

export type DIC<T> = {
  [id: string]: T
}
type ARY<T> = T[]

export function dic<T>(
  o1: DIC<DIC<DIC<DIC<DIC<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: DIC<DIC<DIC<DIC<ARY<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: []
): ARY<T>
export function dic<T>(
  o1: DIC<DIC<DIC<DIC<ARY<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: DIC<DIC<DIC<ARY<DIC<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: DIC<DIC<DIC<ARY<ARY<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: []
): ARY<T>
export function dic<T>(
  o1: DIC<DIC<DIC<ARY<ARY<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: DIC<DIC<ARY<DIC<DIC<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: DIC<DIC<ARY<DIC<ARY<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: []
): ARY<T>
export function dic<T>(
  o1: DIC<DIC<ARY<DIC<ARY<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: DIC<DIC<ARY<ARY<DIC<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: DIC<DIC<ARY<ARY<ARY<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: []
): ARY<T>
export function dic<T>(
  o1: DIC<DIC<ARY<ARY<ARY<T>>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: DIC<ARY<DIC<DIC<DIC<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: DIC<ARY<DIC<DIC<ARY<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: []
): ARY<T>
export function dic<T>(
  o1: DIC<ARY<DIC<DIC<ARY<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: DIC<ARY<DIC<ARY<DIC<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: DIC<ARY<DIC<ARY<ARY<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: []
): ARY<T>
export function dic<T>(
  o1: DIC<ARY<DIC<ARY<ARY<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: DIC<ARY<ARY<DIC<DIC<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: DIC<ARY<ARY<DIC<ARY<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: []
): ARY<T>
export function dic<T>(
  o1: DIC<ARY<ARY<DIC<ARY<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: DIC<ARY<ARY<ARY<DIC<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: DIC<ARY<ARY<ARY<ARY<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: []
): ARY<T>
export function dic<T>(
  o1: DIC<ARY<ARY<ARY<ARY<T>>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: ARY<DIC<DIC<DIC<DIC<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: ARY<DIC<DIC<DIC<ARY<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: []
): ARY<T>
export function dic<T>(
  o1: ARY<DIC<DIC<DIC<ARY<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: ARY<DIC<DIC<ARY<DIC<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: ARY<DIC<DIC<ARY<ARY<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: []
): ARY<T>
export function dic<T>(
  o1: ARY<DIC<DIC<ARY<ARY<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: ARY<DIC<ARY<DIC<DIC<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: ARY<DIC<ARY<DIC<ARY<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: []
): ARY<T>
export function dic<T>(
  o1: ARY<DIC<ARY<DIC<ARY<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: ARY<DIC<ARY<ARY<DIC<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: ARY<DIC<ARY<ARY<ARY<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: []
): ARY<T>
export function dic<T>(
  o1: ARY<DIC<ARY<ARY<ARY<T>>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: ARY<ARY<DIC<DIC<DIC<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: ARY<ARY<DIC<DIC<ARY<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: []
): ARY<T>
export function dic<T>(
  o1: ARY<ARY<DIC<DIC<ARY<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: ARY<ARY<DIC<ARY<DIC<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: ARY<ARY<DIC<ARY<ARY<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: []
): ARY<T>
export function dic<T>(
  o1: ARY<ARY<DIC<ARY<ARY<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: ARY<ARY<ARY<DIC<DIC<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: ARY<ARY<ARY<DIC<ARY<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: []
): ARY<T>
export function dic<T>(
  o1: ARY<ARY<ARY<DIC<ARY<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: [],
  id5: number,
  o6: {}
): T
export function dic<T>(
  o1: ARY<ARY<ARY<ARY<DIC<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: {},
  id5: string,
  o6: {}
): T
export function dic<T>(
  o1: ARY<ARY<ARY<ARY<ARY<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: []
): ARY<T>
export function dic<T>(
  o1: ARY<ARY<ARY<ARY<ARY<T>>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: [],
  id5: number,
  o6: {}
): T

export function dic<T>(
  o1: DIC<DIC<DIC<DIC<T>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: {}
): T
export function dic<T>(
  o1: DIC<DIC<DIC<ARY<T>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: []
): ARY<T>
export function dic<T>(
  o1: DIC<DIC<DIC<ARY<T>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: {}
): T
export function dic<T>(
  o1: DIC<DIC<ARY<DIC<T>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: {}
): T
export function dic<T>(
  o1: DIC<DIC<ARY<ARY<T>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: []
): ARY<T>
export function dic<T>(
  o1: DIC<DIC<ARY<ARY<T>>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: {}
): T
export function dic<T>(
  o1: DIC<ARY<DIC<DIC<T>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: {}
): T
export function dic<T>(
  o1: DIC<ARY<DIC<ARY<T>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: []
): ARY<T>
export function dic<T>(
  o1: DIC<ARY<DIC<ARY<T>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: {}
): T
export function dic<T>(
  o1: DIC<ARY<ARY<DIC<T>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: {}
): T
export function dic<T>(
  o1: DIC<ARY<ARY<ARY<T>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: []
): ARY<T>
export function dic<T>(
  o1: DIC<ARY<ARY<ARY<T>>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: {}
): T
export function dic<T>(
  o1: ARY<DIC<DIC<DIC<T>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: {}
): T
export function dic<T>(
  o1: ARY<DIC<DIC<ARY<T>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: []
): ARY<T>
export function dic<T>(
  o1: ARY<DIC<DIC<ARY<T>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: {}
): T
export function dic<T>(
  o1: ARY<DIC<ARY<DIC<T>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: {}
): T
export function dic<T>(
  o1: ARY<DIC<ARY<ARY<T>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: []
): ARY<T>
export function dic<T>(
  o1: ARY<DIC<ARY<ARY<T>>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: {}
): T
export function dic<T>(
  o1: ARY<ARY<DIC<DIC<T>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {},
  id4: string,
  o5: {}
): T
export function dic<T>(
  o1: ARY<ARY<DIC<ARY<T>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: []
): ARY<T>
export function dic<T>(
  o1: ARY<ARY<DIC<ARY<T>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: [],
  id4: number,
  o5: {}
): T
export function dic<T>(
  o1: ARY<ARY<ARY<DIC<T>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {},
  id4: string,
  o5: {}
): T
export function dic<T>(
  o1: ARY<ARY<ARY<ARY<T>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: []
): ARY<T>
export function dic<T>(
  o1: ARY<ARY<ARY<ARY<T>>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: [],
  id4: number,
  o5: {}
): T

export function dic<T>(
  o1: DIC<DIC<DIC<T>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {}
): T
export function dic<T>(o1: DIC<DIC<ARY<T>>>, id1: string, o2: {}, id2: string, o3: []): ARY<T>
export function dic<T>(
  o1: DIC<DIC<ARY<T>>>,
  id1: string,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {}
): T
export function dic<T>(
  o1: DIC<ARY<DIC<T>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {}
): T
export function dic<T>(o1: DIC<ARY<ARY<T>>>, id1: string, o2: [], id2: number, o3: []): ARY<T>
export function dic<T>(
  o1: DIC<ARY<ARY<T>>>,
  id1: string,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {}
): T
export function dic<T>(
  o1: ARY<DIC<DIC<T>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: {},
  id3: string,
  o4: {}
): T
export function dic<T>(o1: ARY<DIC<ARY<T>>>, id1: number, o2: {}, id2: string, o3: []): ARY<T>
export function dic<T>(
  o1: ARY<DIC<ARY<T>>>,
  id1: number,
  o2: {},
  id2: string,
  o3: [],
  id3: number,
  o4: {}
): T
export function dic<T>(
  o1: ARY<ARY<DIC<T>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: {},
  id3: string,
  o4: {}
): T
export function dic<T>(o1: ARY<ARY<ARY<T>>>, id1: number, o2: [], id2: number, o3: []): ARY<T>
export function dic<T>(
  o1: ARY<ARY<ARY<T>>>,
  id1: number,
  o2: [],
  id2: number,
  o3: [],
  id3: number,
  o4: {}
): T

export function dic<T>(o1: DIC<DIC<T>>, id1: string, o2: {}, id2: string, o3: {}): T
export function dic<T>(o1: DIC<ARY<T>>, id1: string, o2: []): ARY<T>
export function dic<T>(o1: DIC<ARY<T>>, id1: string, o2: [], id2: number, o3: {}): T
export function dic<T>(o1: ARY<DIC<T>>, id1: number, o2: {}, id2: string, o3: {}): T
export function dic<T>(o1: ARY<ARY<T>>, id1: number, o2: []): ARY<T>
export function dic<T>(o1: ARY<ARY<T>>, id1: number, o2: [], id2: number, o3: {}): T

export function dic<T>(o1: DIC<T>, id1: string, o2: {}): T
export function dic<T>(o1: ARY<T>, id1: number, o2: {}): T

export function dic<T>(o, ...levels: any): T {
  for (let i = 0; i < levels.length; i += 2) {
    const id = levels[i] as string | number
    const format = levels[i + 1] as {} | []
    if (!o[id]) o[id] = format
    o = o[id]
  }
  return o
}

export function MapReduce<IdType, T extends BaseT<IdType>, F extends BaseF<T>>({
  format,
  reduce,
  order
}: MapReduceProps<T, F>) {
  const hash = {} as { [id: string]: T }
  const data = { ...format() }
  const find = (id: T['_id']) => hash[id.toString()]
  return { add, del, find, format, data }

  function full_calculate() {
    Object.assign(data, format())
    for (let size = data.list.length, idx = 0; idx < size; ++idx) {
      const doc = data.list[idx]
      reduce(data, doc)
    }
  }

  function add(docs: T[]) {
    for (const doc of docs) {
      const id = doc._id.toString()

      if (hash[id]) {
      } else {
        data.list.push(doc)
        reduce(data, doc)
      }
      hash[id] = doc
    }
    order(data, { sort })
  }

  function del(ids: T['_id'][]) {
    for (const id of ids) {
      delete hash[id.toString()]
    }
    data.list = data.list.filter((o) => hash[o._id.toString()])
  }
}
