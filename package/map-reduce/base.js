import { writable } from 'svelte/store';
import { __BROWSER__ } from 'svelte-petit-utils';
import * as dic from './dic';
export const OrderUtils = {
  sort: dic.sort,
  group_sort: dic.group_sort
};
function nop(...args) {}
export function lookup(o) {
  const data = o.format();
  const { subscribe, set } = writable(data, (set) => {
    o.subscribe((data) => {
      sort(...sArgs);
      set(data);
    }, o);
  });
  let sArgs = [];
  return { sort, format: o.format, data, subscribe };
  function sort(...sa) {
    if (o.order) o.order(data, { sort: dic.sort, group_sort: dic.group_sort }, ...(sArgs = sa));
    set(data);
  }
}
export function MapReduce({ format, initialize = nop, reduce, order, start }) {
  const children = new Map();
  const map = new Map();
  const data = format();
  const find = (id) => map.get(id);
  const { subscribe, set } = writable(format(), __BROWSER__ ? start : undefined);
  let sArgs = [];
  return { deploy, clear, add, del, find, reduce: doReduce, filter, sort, format, data, subscribe };
  function sort(...sa) {
    if (order) order(data, { sort: dic.sort, group_sort: dic.group_sort }, ...(sArgs = sa));
    set(data);
  }
  function full_calculate() {
    const { list } = data;
    clear();
    for (const doc of list) {
      data.list.push(doc);
      reduce(data, doc);
    }
  }
  function deploy(json, init = initialize) {
    const list = [];
    for (const _id in json) {
      const o = json[_id];
      o._id = _id;
      list.push(o);
    }
    add(list, init);
  }
  function filter(validator, key = validator.toString()) {
    return query;
    function query(...filter_args) {
      const child = MapReduce({ format, reduce, order });
      children.set(key, { validator, filter_args, add: child.add, del: child.del });
      // child.clear()
      child.add(data.list.filter((o) => validator(o, ...filter_args)));
      return {
        reduce: child.reduce,
        filter: child.filter,
        sort: child.sort,
        data: child.data,
        subscribe: child.subscribe,
        validator
      };
    }
  }
  function doReduce(ids, emit) {
    const map = new Map();
    for (const id of ids) {
      const item = find(id);
      if (!item) continue;
      map.set(id, { ...item });
    }
    const list = [...map.values()];
    for (const item of list) {
      emit(item);
    }
    return dic.sort(list);
  }
  function clear() {
    Object.assign(data, format());
    set(data);
  }
  function add(docs, init = initialize) {
    let is_update = false;
    for (const doc of docs) {
      const id = doc._id;
      if (find(id)) {
        is_update = true;
      } else {
        data.list.push(doc);
        init && init(doc);
        reduce(data, doc);
      }
      map.set(id, doc);
    }
    if (is_update) full_calculate();
    sort(...sArgs);
    set(data);
    for (const { validator, filter_args, add } of children.values()) {
      add(docs.filter((o) => validator(o, ...filter_args)));
    }
  }
  function del(ids) {
    let is_update = false;
    for (const id of ids) {
      if (map.delete(id)) is_update = true;
    }
    if (is_update) full_calculate();
    set(data);
    for (const { del } of children.values()) {
      del(ids);
    }
  }
}
