import { __BROWSER__ } from '$lib/browser/device'
import { writable } from 'svelte/store'

export function hash<T extends string>(init: T = undefined) {
  if (!__BROWSER__) return writable<T>(init || undefined)
  const value = location.hash.slice(1)

  const ret = writable(value || init)
  ret.subscribe(setHash)
  return ret
}

export function setHash(hash: string) {
  if (!__BROWSER__) return
  const url = new URL(location.href)
  url.hash = hash || ''
  history.pushState({}, '', url)
}
