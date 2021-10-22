import type { Readable } from 'svelte/store'
import type { DocumentId } from '$lib/db'

import { io } from 'socket.io-client'
import parser from 'socket.io-msgpack-parser'
import { inPlaceSort } from 'fast-sort'
import { readable } from 'svelte/store'
import { __BROWSER__ } from '$lib/browser'

type BaseT<IdType> = {
  _id: IdType
}

type BaseF<T> = {
  list: T[]
}

type MapReduceProps<T, F> = {
  format: () => F
  order: (o: F, option: { sort: typeof sort }) => void
  reduce: (o: F, doc: T) => void
}

type ModelSocket<MatchArgs extends any[], IdType, T, F> = {
  query(...args: MatchArgs): Readable<F>

  set?(docs: T[]): void
  del?(ids: IdType[]): void
}

function sort<IdType, D extends { _id: IdType }>(value: D[] | { [id: string]: D }) {
  if (!(value instanceof Array)) {
    const list = [] as D[]
    for (const id in value) {
      const item = value[id]
      item._id = id as any
      list.push(item)
    }
    value = list
  }
  return inPlaceSort<D>(value)
}

export function MapReduce<IdType, T extends BaseT<IdType>, F extends BaseF<T>>({
  order,
  format,
  reduce
}: MapReduceProps<T, F>) {
  const hash = {} as { [id: string]: T }
  const data = { ...format() }
  const find = (id: T['_id'][]) => hash[id.toString()]
  return { add, del, find, format, data }

  function add(docs: T[]) {
    for (let size = docs.length, idx = 0; idx < size; ++idx) {
      const doc = docs[idx]
      const id = doc._id.toString()

      hash[id] = doc
      data.list.push(doc)
      reduce(data, doc)
    }
    order(data, { sort })
  }

  function del(ids: T['_id'][]) {
    for (let size = ids.length, idx = 0; idx < size; ++idx) {
      const id = ids[idx].toString()
      delete hash[id]
    }
    data.list = data.list.filter((o) => hash[o._id.toString()])

    Object.assign(data, format())
    for (let size = data.list.length, idx = 0; idx < size; ++idx) {
      const doc = data.list[idx]
      reduce(data, doc)
    }
  }
}

export default function socket(uri: string) {
  if (!__BROWSER__) return Proxy

  const PubSub = io(uri, {
    parser
  })
  PubSub.open()

  console.log(`${PubSub.id} <-> connecting...`)
  return Proxy

  function Proxy<
    IdType extends DocumentId,
    T extends BaseT<IdType>,
    F extends BaseF<T>,
    MatchArgs extends any[]
  >(api: string, map_reduce: MapReduceProps<T, F>): ModelSocket<MatchArgs, IdType, T, F> {
    return {
      query(...args: MatchArgs) {
        const mr = MapReduce<IdType, T, F>(map_reduce)
        if (!__BROWSER__) return readable<F>(mr.format())

        const { subscribe } = readable<F>(mr.format(), (set) => {
          PubSub.on(`SET:${api}`, (docs: T[]) => {
            mr.add(docs)
            console.log(`${PubSub.id} <- set ${docs.length} items.`)
            set(mr.data)
          })
          PubSub.on(`DEL:${api}`, (ids: IdType[]) => {
            mr.del(ids)
            console.log(`${PubSub.id} <- del ${ids.length} items.`)
            set(mr.data)
          })
          PubSub.on(`SET:ERROR:${api}`, (docs: T[]) => {})
          PubSub.on(`DEL:ERROR:${api}`, (ids: IdType[]) => {})

          PubSub.emit('query', api, ...args)

          return () => {
            PubSub.off(`SET:${api}`)
            PubSub.off(`DEL:${api}`)
            PubSub.off(`SET:ERROR:${api}`)
            PubSub.off(`DEL:ERROR:${api}`)
          }
        })
        return { subscribe }
      },

      set(docs) {
        if (!__BROWSER__) return
        PubSub.emit('set', api, docs)
      },

      del(ids) {
        if (!__BROWSER__) return
        PubSub.emit('del', api, ids)
      }
    }
  }
}
