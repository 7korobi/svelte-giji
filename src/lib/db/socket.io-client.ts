import type { Document } from 'mongodb'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { Readable } from 'svelte/store'
import type { BaseF, BaseT, MapReduceProps } from '$lib/map-reduce'

import { io, Socket } from 'socket.io-client'
import parser from 'socket.io-msgpack-parser'
import { readable } from 'svelte/store'

import { MapReduce } from '$lib/map-reduce'
import { __BROWSER__ } from '$lib/browser/device'

type QueryProps<MatchArgs extends any[]> = {
  name?: string
  qid: (...args: MatchArgs) => string
}

type ModelSocket<MatchArgs extends any[], IdType, T extends BaseT<any>, F> = {
  query(
    ...args: MatchArgs
  ): Readable<F> & {
    find(id: T['_id']): T
  }

  set?(docs: T[]): void
  del?(ids: IdType[]): void
}

type StoreEntry<
  MatchArgs extends any[],
  T extends BaseT<any>,
  F extends BaseF<Document>
> = QueryProps<MatchArgs> & MapReduceProps<T, F>
export type BaseStoreEntry = StoreEntry<any[], BaseT<any>, BaseF<Document>>

let STORE = {} as {
  [name: string]: BaseStoreEntry
}
let PubSub: Socket<DefaultEventsMap, DefaultEventsMap>

export function model<IdType, T extends BaseT<IdType>, F extends BaseF<T>, MatchArgs extends any[]>(
  options: QueryProps<MatchArgs> & MapReduceProps<T, F>
): QueryProps<MatchArgs> & MapReduceProps<T, F> {
  const o = { ...options, qid }
  return o
  function qid(...args: MatchArgs) {
    return `${o.name}(${options.qid(...args)})`
  }
}

export default function client(uri: string, stores: typeof STORE) {
  STORE = stores
  for (const name in stores) {
    stores[name].name = name
  }

  if (!__BROWSER__) return

  PubSub = io(uri, {
    parser
  })
  PubSub.open()

  console.log(`${PubSub.id} <-> connecting...`)
}

export function socket<
  IdType,
  T extends BaseT<IdType>,
  F extends BaseF<T>,
  MatchArgs extends any[]
>({
  name,
  qid,
  format,
  order,
  reduce
}: QueryProps<MatchArgs> & MapReduceProps<T, F>): ModelSocket<MatchArgs, IdType, T, F> {
  return {
    query(...args: MatchArgs) {
      const api = qid(...args)
      const mr = MapReduce<IdType, T, F>({ format, order, reduce })
      if (!__BROWSER__) return { ...readable<F>(mr.format()), find: mr.find }

      const { subscribe } = readable<F>(mr.format(), (set) => {
        PubSub.on(`SET:${api}`, (docs: T[]) => {
          mr.add(docs)
          console.log(`${PubSub.id} <- set ${docs.length} items by ${api}`)
          set(mr.data)
        })
        PubSub.on(`DEL:${api}`, (ids: IdType[]) => {
          mr.del(ids)
          console.log(`${PubSub.id} <- del ${ids.length} items by ${api}`)
          set(mr.data)
        })
        PubSub.on(`SET:ERROR:${name}`, (docs: T[]) => {})
        PubSub.on(`DEL:ERROR:${name}`, (ids: IdType[]) => {})

        console.log({ name, api, args })
        PubSub.emit('query', name, ...args)

        return () => {
          PubSub.off(`SET:${api}`)
          PubSub.off(`DEL:${api}`)
          PubSub.off(`SET:ERROR:${name}`)
          PubSub.off(`DEL:ERROR:${name}`)
        }
      })
      return { subscribe, find: mr.find }
    },

    set(docs) {
      if (!__BROWSER__) return
      PubSub.emit('set', name, docs)
    },

    del(ids) {
      if (!__BROWSER__) return
      PubSub.emit('del', name, ids)
    }
  }
}
