import { derived, writable } from 'svelte/store'
import { __BROWSER__ } from '$lib/browser/device'

export const sameSites = writable(__BROWSER__ ? [location.origin] : [])
export const regSites = derived([sameSites], ([$sameSites], set: (reg: RegExp) => void) => {
  const reg = new RegExp(`^${$sameSites.join('|^')}`)
  set(reg)
})
