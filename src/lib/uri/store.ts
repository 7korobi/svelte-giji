import { __BROWSER__ } from '$lib/browser/device'
import { writable } from 'svelte/store'

export function hash<T extends string>(init: T = undefined) {
  if (!__BROWSER__) return writable<T>(init || undefined)
  const value = location.hash.slice(1) as T

  const ret = writable<T>(value || init)
  ret.subscribe(setHash)
  return ret
}

export function search<T extends string>(key: string, init: T[] = undefined) {
  if (!__BROWSER__) return writable<T[]>(init || undefined)
  const url = new URL(location.href)
  const value = url.searchParams.getAll(key) as T[]

  const ret = writable<T[]>(value.length ? value : init)
  ret.subscribe(setSearch.bind(null, key))
  return ret
}

export function setHash<T extends string>(hash: T) {
  if (!__BROWSER__) return
  const url = new URL(location.href)
  url.hash = hash || ''
  history.pushState({}, '', url)
}

export function setSearch<T extends string>(key: string, query: T[]) {
  if (!__BROWSER__) return
  const url = new URL(location.href)
  url.searchParams.delete(key)
  for (const value of query) {
    url.searchParams.append(key, value)
  }
  history.pushState({}, '', url)
}
