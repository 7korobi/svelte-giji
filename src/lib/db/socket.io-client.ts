import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { Readable } from 'svelte/store'
import type { BaseF, BaseT, MapReduceProps } from '$lib/map-reduce'
import type * as dic from '$lib/map-reduce/dic'

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
  F extends BaseF<BaseT<any>>,
  MatchArgs extends any[],
  OrderArgs extends any[]
> = QueryProps<MatchArgs> & MapReduceProps<F, OrderArgs>
export type BaseStoreEntry = StoreEntry<BaseF<BaseT<any>>, any[], any[]>

let STORE = {} as {
  [name: string]: BaseStoreEntry
}
let PubSub: Socket<DefaultEventsMap, DefaultEventsMap>

const PubSubCache = {}

export function model<
  F extends BaseF<BaseT<any>>,
  MatchArgs extends any[],
  OrderArgs extends any[]
>(
  props: StoreEntry<F, MatchArgs, OrderArgs>
): {
  name?: string
  qid: (...args: MatchArgs) => string
  format: () => F
  reduce: (o: F, doc: F['list'][number]) => void
  order: (
    o: F,
    { sort, group_sort }: { sort: typeof dic.sort; group_sort: typeof dic.group_sort },
    ...args: OrderArgs
  ) => void
} {
  const o = { ...props, qid }
  return o
  function qid(...args: MatchArgs) {
    return `${o.name}(${props.qid(...args)})`
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
}: StoreEntry<F, MatchArgs, OrderArgs>): {
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
      const mr = MapReduce<F, OrderArgs>({ format, order, reduce })
      const api = qid(...qa)

      if (PubSubCache[api]) return PubSubCache[api]
      if (!__BROWSER__)
        return (PubSubCache[api] = { ...readable<F>(mr.format()), find: mr.find, sort })

      const { subscribe, set } = writable<F>(mr.format(), (set) => {
        PubSub.on(`SET:${api}`, SET)
        PubSub.on(`DEL:${api}`, DEL)
        PubSub.on(`SET:ERROR:${name}`, SET_ERROR)
        PubSub.on(`DEL:ERROR:${name}`, DEL_ERROR)
        PubSub.emit('query', name, ...qa)

        return () => {
          delete PubSubCache[api]
          PubSub.emit('leave', name, ...qa)
          PubSub.off(`SET:${api}`)
          PubSub.off(`DEL:${api}`)
          PubSub.off(`SET:ERROR:${name}`)
          PubSub.off(`DEL:ERROR:${name}`)
        }
      })
      return (PubSubCache[api] = { subscribe, find: mr.find, sort })

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
