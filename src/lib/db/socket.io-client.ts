import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { Readable } from 'svelte/store'
import type { BaseF, BaseT, MapReduceProps, OrderUtils } from 'svelte-map-reduce-store'

import { io, Socket } from 'socket.io-client'
import parser from 'socket.io-msgpack-parser'

import { MapReduce } from 'svelte-map-reduce-store'
import { __BROWSER__ } from 'svelte-petit-utils'

type QueryProps<MatchArgs extends any[]> = {
  name?: string
  qid: (...args: MatchArgs) => string
}

type StoreQuery<F extends BaseF<BaseT<any>>, OrderArgs extends any[]> = Readable<F> & {
  find(id: F['list'][number]['_id']): F['list'][number]
  sort(...args: OrderArgs): void
}

type StoreEntry<
  F extends BaseF<BaseT<any>>,
  OrderArgs extends any[],
  MatchArgs extends any[]
> = QueryProps<MatchArgs> & MapReduceProps<F, OrderArgs>
export type BaseStoreEntry = StoreEntry<BaseF<BaseT<any>>, any[], any[]>

let STORE = {} as {
  [name: string]: BaseStoreEntry
}
let PubSub: Socket<DefaultEventsMap, DefaultEventsMap>

const PubSubCache = {}

export function model<
  F extends BaseF<BaseT<any>>,
  OrderArgs extends any[],
  MatchArgs extends any[]
>(
  props: StoreEntry<F, OrderArgs, MatchArgs>
): {
  name?: string
  qid: (...args: MatchArgs) => string
  index?: (_id: F['list'][number]['_id']) => string | number | boolean | null
  format: () => F
  reduce: (o: F, doc: F['list'][number]) => void
  order: (o: F, { sort, group_sort }: typeof OrderUtils, ...args: OrderArgs) => void
}

export function model<F extends BaseF<BaseT<any>>, OrderArgs extends any[]>(
  props: MapReduceProps<F, OrderArgs>
): {
  index?: (_id: F['list'][number]['_id']) => string | number | boolean | null
  format: () => F
  reduce: (o: F, doc: F['list'][number]) => void
  order: (o: F, { sort, group_sort }: typeof OrderUtils, ...args: OrderArgs) => void
}

export function model(props: any) {
  return props
}

export default function client(uri: string, stores: typeof STORE) {
  STORE = stores
  for (const name in stores) {
    stores[name].name ??= name
  }

  if (!__BROWSER__) return
  if (PubSub) return
  PubSub = io(uri, {
    parser
  })
  PubSub.open()
}

type StoresValues<T> = T extends Readable<infer U>
  ? U
  : {
      [K in keyof T]: T[K] extends Readable<infer U> ? U : never
    }

type Look<F extends BaseF<any>> = {
  lookup?: (
    data: F,
    looked: <S extends Readable<any>[], T>(stores: S, cb: (values: StoresValues<S>) => void) => void
  ) => void
}

export async function fcm(token: string, appends: string[], deletes: string[]) {
  return new Promise<boolean>((ok, ng) => {
    if (appends.length || deletes.length) {
      PubSub.emit('fcm', token, appends, deletes, ok)
    } else {
      ok(false)
    }
  })
}

export function socket<F extends BaseF<any>, MatchArgs extends any[], OrderArgs extends any[]>({
  name,
  qid,
  index = (_id) => _id,
  format,
  order,
  reduce
}: StoreEntry<F, OrderArgs, MatchArgs>): {
  query(...args: MatchArgs): StoreQuery<F, OrderArgs>
  set?(docs: F['list'][number][]): void
  del?(ids: F['list'][number]['_id'][]): void
} {
  return {
    query(...qa: MatchArgs) {
      const api = `${name}(${qid(...qa)})`
      console.log(api, PubSubCache[api])
      if (PubSubCache[api]) return PubSubCache[api]

      const { subscribe, find, sort, add, del } = MapReduce<F, OrderArgs>({
        index,
        format,
        order,
        reduce,
        start(set) {
          PubSub.on(`SET:${api}`, add)
          PubSub.on(`DEL:${api}`, del)
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
        }
      })

      return (PubSubCache[api] = { subscribe, find, sort })

      function SET_ERROR(docs: F['list'][number][]) {
        console.log(`SET ERROR ${name}`, docs)
      }
      function DEL_ERROR(ids: F['list'][number]['_id'][]) {
        console.log(`DEL ERROR ${name}`, ids)
      }
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
