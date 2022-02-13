import type { SortCmd } from './fast-sort'
import { writable } from 'svelte/store'
import { __BROWSER__ } from 'svelte-petit-utils'
import * as dic from './dic'

export type BaseT<IdType> = {
  _id: IdType
}

export type BaseF<T> = {
  list: T[]
}

export type MapReduceProps<F extends BaseF<any>, OrderArgs extends any[], Index> = {
  format: () => F
  index?: (_id: F['list'][number]['_id']) => Index
  initialize?: (doc: F['list'][number]) => void
  reduce: (o: F, doc: F['list'][number]) => void
  order: (o: F, utils: typeof OrderUtils, ...args: OrderArgs) => void
  start?: (set: (value: F) => void) => void | (() => void)
}

export const OrderUtils = {
  sort: dic.sort,
  group_sort: dic.group_sort
}

type Validator<A extends any[], F extends BaseF<any>> = (
  o: F['list'][number],
  ...args: A
) => boolean

type LookupProps<F, OrderArgs extends any[]> = {
  format: () => F
  subscribe: (set: (value: F) => void, lookup: LookupProps<F, OrderArgs>) => void
  order: (o: F, { sort, group_sort }: typeof OrderUtils, ...args: OrderArgs) => void
}

function nop(...args: any[]) {}

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

export function MapReduce<F extends BaseF<any>, OrderArgs extends any[], Index>({
  format,
  index = (_id: F['list'][number]['_id']) => _id,
  initialize = nop,
  reduce,
  order,
  start
}: MapReduceProps<F, OrderArgs, Index>) {
  const children = new Map<
    string,
    {
      validator: Validator<any[], F>
      filter_args: any[]
      add(docs: F['list']): void
      del(ids: F['list'][number]['_id'][]): void
    }
  >()
  const map = new Map<Index, F['list'][number]>()
  const data = format()
  const find = (_id: F['list'][number]['_id']) => map.get(index(_id))
  const { subscribe, set } = writable<F>(format(), __BROWSER__ ? start : undefined)
  let sArgs = [] as OrderArgs

  return {
    deploy,
    clear,
    add,
    del,
    find,
    index,
    reduce: doReduce,
    filter,
    sort,
    format,
    data,
    subscribe
  }

  function sort(...sa: OrderArgs) {
    if (order) order(data, { sort: dic.sort, group_sort: dic.group_sort }, ...(sArgs = sa))
    set(data)
  }

  function full_calculate() {
    const { list } = data
    clear()
    for (const doc of list) {
      data.list.push(doc)
      reduce(data, doc)
    }
  }

  function deploy(json: any, init = initialize) {
    const list: F['list'][number][] = []
    for (const _id in json) {
      const o = json[_id]
      o._id = _id
      list.push(o)
    }
    add(list, init)
  }

  function filter<A extends any[]>(validator: Validator<A, F>, key = validator.toString()) {
    return query

    function query(...filter_args: A) {
      const child = MapReduce({ index, format, reduce, order })

      children.set(key, { validator, filter_args, add: child.add, del: child.del })
      // child.clear()
      child.add(data.list.filter((o: F['list'][number]) => validator(o, ...filter_args)))
      return {
        reduce: child.reduce,
        filter: child.filter,
        sort: child.sort,
        data: child.data,
        subscribe: child.subscribe,
        validator
      }
    }
  }

  function doReduce<EMIT>(
    ids: F['list'][number]['_id'][],
    emit: (o: EMIT) => void
  ): SortCmd<F['list'][number] & EMIT> {
    const map = new Map<Index, F['list'][number]>()
    for (const _id of ids) {
      const item = find(_id)
      if (!item) continue
      map.set(index(_id), { ...item })
    }
    const list = [...map.values()]
    for (const item of list) {
      emit(item)
    }
    return dic.sort(list)
  }

  function clear() {
    Object.assign(data, format())
    set(data)
  }

  function add(docs: F['list'], init = initialize) {
    let is_update = false
    for (const doc of docs) {
      if (find(doc._id)) {
        is_update = true
      } else {
        data.list.push(doc)
        init && init(doc)
        reduce(data, doc)
      }
      map.set(index(doc._id), doc)
    }
    if (is_update) full_calculate()
    sort(...sArgs)
    set(data)
    for (const { validator, filter_args, add } of children.values()) {
      add(docs.filter((o: F['list'][number]) => validator(o, ...filter_args)))
    }
  }

  function del(ids: F['list'][number]['_id'][]) {
    let is_update = false
    for (const _id of ids) {
      if (map.delete(index(_id))) is_update = true
    }
    if (is_update) full_calculate()
    set(data)
    for (const { del } of children.values()) {
      del(ids)
    }
  }
}
