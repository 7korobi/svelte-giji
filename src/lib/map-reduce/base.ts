import type { DIC } from './dic'
import type { SortCmd } from './fast-sort'
import { writable } from 'svelte/store'
import { __BROWSER__ } from '$lib/browser-device'
import * as dic from './dic'

export type BaseT<IdType> = {
  _id: IdType
}

export type BaseF<T> = {
  list: T[]
}

export type MapReduceProps<F extends BaseF<any>, OrderArgs extends any[]> = {
  format: () => F
  reduce: (o: F, doc: F['list'][number]) => void
  order: (o: F, utils: typeof OrderUtils, ...args: OrderArgs) => void
  start?: (set: (value: F) => void) => void | (() => void)
}

export const OrderUtils = {
  sort: dic.sort,
  group_sort: dic.group_sort
}

type LookupProps<F, OrderArgs extends any[]> = {
  format: () => F
  subscribe: (set: (value: F) => void, lookup: LookupProps<F, OrderArgs>) => void
  order: (o: F, { sort, group_sort }: typeof OrderUtils, ...args: OrderArgs) => void
}

export function lookup<F, OrderArgs extends any[]>(o: LookupProps<F, OrderArgs>) {
  const data = o.format()
  const { subscribe, set } = writable<F>(data, (set) => {
    o.subscribe((data) => {
      sort(...sArgs)
      set(data)
    }, o)
  })

  let sArgs = [] as OrderArgs
  return { sort, format: o.format, data, subscribe }
  function sort(...sa: OrderArgs) {
    if (o.order) o.order(data, { sort: dic.sort, group_sort: dic.group_sort }, ...(sArgs = sa))
    set(data)
  }
}

export function MapReduce<F extends BaseF<any>, OrderArgs extends any[]>({
  format,
  reduce,
  order,
  start
}: MapReduceProps<F, OrderArgs>) {
  const map = new Map<F['list'][number]['_id'], F['list'][number]>()
  const data = format()
  const find = (id: F['list'][number]['_id']) => map.get(id)
  const { subscribe, set } = writable<F>(format(), __BROWSER__ ? start : undefined)
  let sArgs = [] as OrderArgs

  return { deploy, add, del, find, reduce: doReduce, sort, format, data, subscribe }

  function sort(...sa: OrderArgs) {
    if (order) order(data, { sort: dic.sort, group_sort: dic.group_sort }, ...(sArgs = sa))
    set(data)
  }

  function full_calculate() {
    const { list } = data
    Object.assign(data, format())
    for (const doc of list) {
      data.list.push(doc)
      reduce(data, doc)
    }
  }

  function deploy(json: any) {
    const list: F['list'][number][] = []
    for (const _id in json) {
      const o = json[_id]
      o._id = _id
      list.push(o)
    }
    add(list)
  }

  function doReduce<EMIT>(
    ids: F['list'][number]['_id'][],
    emit: (o: EMIT) => void
  ): SortCmd<F['list'][number] & EMIT> {
    const map = new Map<F['list'][number]['_id'], F['list'][number]>()
    for (const id of ids) {
      const item = find(id)
      if (!item) continue
      map.set(id, { ...item })
    }
    const list = Array.from(map.values())
    for (const item of list) {
      emit(item)
    }
    return dic.sort(list)
  }

  function add(docs: F['list'][number][]) {
    let is_update = false
    for (const doc of docs) {
      const id = doc._id

      if (find(id)) {
        is_update = true
      } else {
        data.list.push(doc)
        reduce(data, doc)
      }
      map.set(id, doc)
    }
    if (is_update) full_calculate()
    sort(...sArgs)
    set(data)
  }

  function del(ids: F['list'][number]['_id'][]) {
    for (const id of ids) {
      map.delete(id)
    }
    full_calculate()
    set(data)
  }
}
