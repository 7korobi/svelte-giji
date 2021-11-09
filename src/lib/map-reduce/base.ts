import { writable } from 'svelte/store'
import { __BROWSER__ } from '$lib/browser/device'
import * as dic from './dic'

export type BaseT<IdType> = {
  _id: IdType
}

export type BaseF<T> = {
  list: T[]
}

export type MapReduceProps<F extends { list: BaseT<any>[] }, OrderArgs extends any[]> = {
  format: () => F
  order: (
    o: F,
    option: { sort: typeof dic.sort; group_sort: typeof dic.group_sort },
    ...args: OrderArgs
  ) => void
  reduce: (o: F, doc: F['list'][number]) => void
  start?: (set: (value: F) => void) => void | (() => void)
}

export function MapReduce<F extends BaseF<any>, OrderArgs extends any[]>({
  format,
  reduce,
  order,
  start = undefined
}: MapReduceProps<F, OrderArgs>) {
  const hash = {} as { [id: string]: F['list'][number] }
  const data = format()
  const find = (id: F['list'][number]['_id']) => hash[id.toString()]
  const { subscribe, set } = writable<F>(format(), __BROWSER__ ? start : undefined)
  let sArgs = [] as OrderArgs

  return { add, del, find, sort, format, data, subscribe }

  function sort(...sa: OrderArgs) {
    order(data, { sort: dic.sort, group_sort: dic.group_sort }, ...(sArgs = sa))
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

  function add(docs: F['list'][number][]) {
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
    set(data)
  }

  function del(ids: F['list'][number]['_id'][]) {
    for (const id of ids) {
      delete hash[id.toString()]
    }
    full_calculate()
    // data.list = data.list.filter((o) => hash[o._id.toString()])
    set(data)
  }
}
