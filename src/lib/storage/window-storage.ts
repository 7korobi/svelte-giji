import { __BROWSER__ } from '$lib/browser'
import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

type Cache = { [key: string]: [Writable<any>, Convert<any>] }
type Convert<T> = {
  parse(str: string): T
  stringify(val: T): string
}

const NUMBER = {
  parse: (s: string) => parseInt(s),
  stringify: (n: number) => n.toString()
}

const STRING = {
  parse: (s: string) => s,
  stringify: (s: string) => s
}

function initConverter<T>(init: T): Convert<T> {
  if ('number' === typeof init) return NUMBER as any
  if ('string' === typeof init) return STRING as any

  return JSON
}


if (__BROWSER__) {
  window.addEventListener('storage', ({ storageArea, key, newValue, oldValue, url }) => {
    let cache: Cache = undefined
    if (window.localStorage === storageArea) cache = local_cache
    if (window.sessionStorage === storageArea) cache = session_cache

    const [store, convert] = cache[key]
    store.set(convert.parse(newValue))
  })
}

const local_cache: Cache = {}
const session_cache: Cache = {}
function writeCache<T>(convert: Convert<T>, cache: Cache, storage: Storage, key: string, initValue: T) {
  if (cache[key]) throw new Error(`${key} duplicated.`)

  initValue = convert.parse(storage.getItem(key)) || initValue

  const store = writable(initValue)
  store.subscribe((newValue) => {
    storage.setItem(key, convert.stringify(newValue))
  })
  cache[key] = [store, convert]
  return store
}

export function writeLocal<T>(key: string, initValue: T, convert = initConverter(initValue) ) {
  if (!__BROWSER__) return writable(initValue)
  return writeCache(convert, local_cache, window.localStorage, key, initValue)
}
export function writeSession<T>(key: string, initValue: T, convert = initConverter(initValue) ) {
  if (!__BROWSER__) return writable(initValue)
  return writeCache(convert, session_cache, window.sessionStorage, key, initValue)
}
