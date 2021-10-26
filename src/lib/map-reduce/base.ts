import { sort, group_sort } from './dic'

export type BaseT<IdType> = {
  _id: IdType
}

export type BaseF<T> = {
  list: T[]
}

export type MapReduceProps<T, F> = {
  format: () => F
  order: (o: F, option: { sort: typeof sort; group_sort: typeof group_sort }) => void
  reduce: (o: F, doc: T) => void
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
    order(data, { sort, group_sort })
  }

  function del(ids: T['_id'][]) {
    for (const id of ids) {
      delete hash[id.toString()]
    }
    data.list = data.list.filter((o) => hash[o._id.toString()])
  }
}
