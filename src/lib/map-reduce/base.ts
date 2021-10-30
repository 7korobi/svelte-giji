import * as dic from './dic'

export type BaseT<IdType> = {
  _id: IdType
}

export type BaseF<T> = {
  list: T[]
}

export type MapReduceProps<T, F, S extends any[]> = {
  format: () => F
  order: (
    o: F,
    option: { sort: typeof dic.sort; group_sort: typeof dic.group_sort },
    ...args: S
  ) => void
  reduce: (o: F, doc: T) => void
}

export function MapReduce<IdType, T extends BaseT<IdType>, F extends BaseF<T>, S extends any[]>({
  format,
  reduce,
  order
}: MapReduceProps<T, F, S>) {
  const hash = {} as { [id: string]: T }
  const data = format()
  let sArgs = [] as S
  const find = (id: T['_id']) => hash[id.toString()]
  return { add, del, find, sort, format, data }

  function full_calculate() {
    Object.assign(data, format())
    for (const doc of data.list) {
      reduce(data, doc)
    }
  }

  function sort(...sa: S) {
    sArgs = sa
    order(data, { sort: dic.sort, group_sort: dic.group_sort }, ...sArgs)
  }

  function add(docs: T[]) {
    let is_update = false
    for (const doc of docs) {
      const id = doc._id.toString()

      if (hash[id]) {
        is_update = true
      } else {
        data.list.push(doc)
        reduce(data, doc)
      }
      hash[id] = doc
    }
    if (is_update) full_calculate()
    sort(...sArgs)
  }

  function del(ids: T['_id'][]) {
    for (const id of ids) {
      delete hash[id.toString()]
    }
    full_calculate()
    // data.list = data.list.filter((o) => hash[o._id.toString()])
  }
}
