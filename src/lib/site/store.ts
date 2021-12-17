import { writable } from 'svelte/store'
import { Bits } from '$lib/inline/bits'
import { writeLocal } from '$lib/storage'
import live from './json/live.json'
import { __BROWSER__ } from '$lib/browser-device'

export const url = writable({
  portrate: 'https://giji.f5.si/images/portrate/',
  icon: 'https://giji.f5.si/images/icon/',
  css: '/css/',
  api: '/api/',
  oldlog: 'https://s3-ap-northeast-1.amazonaws.com/giji-assets/',
  top: '/'
})

export const day = writeLocal('day', 'day')
export const zoom = writeLocal('zoom', 'BG')
export const font = writeLocal('font', 'novel')
export const theme = writeLocal('theme', __BROWSER__ ? 'cinema' : 'snow')

export const welcome_mode = writeLocal('welcome_mode', 'progress')

export const side = writeLocal('side', 0)
export const SideBits = new Bits(
  ['Expand', 'SwipeOn', 'TimelineClock', 'Tree', 'TocOn', 'UsersOn'],
  {}
)
export { live }
