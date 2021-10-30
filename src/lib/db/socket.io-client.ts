import type { Document } from 'mongodb'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { Readable } from 'svelte/store'
import type { BaseF, BaseT, MapReduceProps } from '$lib/map-reduce'

import { io, Socket } from 'socket.io-client'
import parser from 'socket.io-msgpack-parser'
import { readable, writable } from 'svelte/store'

import { MapReduce } from '$lib/map-reduce'
import { __BROWSER__ } from '$lib/browser/device'

type QueryProps<MatchArgs extends any[]> = {
  name?: string
  qid: (...args: MatchArgs) => string
}

type StoreEntry<
  T extends BaseT<any>,
  F extends BaseF<Document>,
  MatchArgs extends any[],
  OrderArgs extends any[]
> = QueryProps<MatchArgs> & MapReduceProps<T, F, OrderArgs>
export type BaseStoreEntry = StoreEntry<BaseT<any>, BaseF<Document>, any[], any[]>

let STORE = {} as {
  [name: string]: BaseStoreEntry
}
let PubSub: Socket<DefaultEventsMap, DefaultEventsMap>

export function model<
  IdType,
  T extends BaseT<IdType>,
  F extends BaseF<T>,
  MatchArgs extends any[],
  OrderArgs extends any[]
>(
  options: QueryProps<MatchArgs> & MapReduceProps<T, F, OrderArgs>
): QueryProps<MatchArgs> & MapReduceProps<T, F, OrderArgs> {
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
  MatchArgs extends any[],
  OrderArgs extends any[]
>({
  name,
  qid,
  format,
  order,
  reduce
}: QueryProps<MatchArgs> & MapReduceProps<T, F, OrderArgs>): {
  query(
    ...args: MatchArgs
  ): Readable<F> & {
    find(id: T['_id']): T
    sort(...args: OrderArgs): void
  }

  set?(docs: T[]): void
  del?(ids: IdType[]): void
} {
  return {
    query(...qa: MatchArgs) {
      const api = qid(...qa)
      const mr = MapReduce<IdType, T, F, OrderArgs>({ format, order, reduce })
      if (!__BROWSER__) return { ...readable<F>(mr.format()), find: mr.find, sort }

      const { subscribe, set } = writable<F>(mr.format(), (set) => {
        PubSub.on(`SET:${api}`, SET)
        PubSub.on(`DEL:${api}`, DEL)
        PubSub.on(`SET:ERROR:${name}`, SET_ERROR)
        PubSub.on(`DEL:ERROR:${name}`, DEL_ERROR)

        console.log({ name, api, qa })
        PubSub.emit('query', name, ...qa)

        return () => {
          PubSub.off(`SET:${api}`)
          PubSub.off(`DEL:${api}`)
          PubSub.off(`SET:ERROR:${name}`)
          PubSub.off(`DEL:ERROR:${name}`)
        }
      })
      return { subscribe, find: mr.find, sort }

      function sort(...sa: OrderArgs): void {
        mr.sort(...sa)
        set(mr.data)
      }

      function SET(docs: T[]) {
        mr.add(docs)
        console.log(`${PubSub.id} <- set ${docs.length} items by ${api}`)
        set(mr.data)
      }

      function SET_ERROR(docs: T[]) {}

      function DEL(ids: IdType[]) {
        mr.del(ids)
        console.log(`${PubSub.id} <- del ${ids.length} items by ${api}`)
        set(mr.data)
      }

      function DEL_ERROR(ids: IdType[]) {}
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
