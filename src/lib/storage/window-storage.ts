import { __BROWSER__ } from '$lib/browser'
import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

type Cache = { [key: string]: Writable<any> }

if (__BROWSER__) {
  window.addEventListener('storage', ({ storageArea, key, newValue, oldValue, url }) => {
    let cache: Cache = undefined
    if (window.localStorage === storageArea) cache = local_cache
    if (window.sessionStorage === storageArea) cache = session_cache
    cache[key].set(JSON.parse(newValue))
  })
}

const local_cache: Cache = {}
const session_cache: Cache = {}
function writeCache<T>(cache: Cache, storage: Storage, key: string, initValue: T) {
  if (cache[key]) throw new Error(`${key} duplicated.`)
  initValue = JSON.parse(storage.getItem(key)) || initValue

  const store = writable(initValue)
  store.subscribe((newValue) => {
    storage.setItem(key, JSON.stringify(newValue))
  })
  cache[key] = store
  return store
}

export function writeLocal<T>(key: string, initValue: T) {
  if (!__BROWSER__) return writable(initValue)
  return writeCache(local_cache, window.localStorage, key, initValue)
}
export function writeSession<T>(key: string, initValue: T) {
  if (!__BROWSER__) return writable(initValue)
  return writeCache(session_cache, window.sessionStorage, key, initValue)
}
