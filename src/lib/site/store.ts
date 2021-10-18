import { writable } from 'svelte/store'
import { Bits } from '$lib/inline/bits'
import { writeLocal } from '$lib/storage'
import live from '$lib/site/json/live.json'

export const url = writable({
  portrate: '/images/portrate/',
  css: '/css/',
  api: '/api/',
  top: '/'
})

export const style = writable({
  icon: {
    width: 90,
    height: 130
  },
  gap_size: 50,
  line_slide: 25,
  border_width: 5,
  rx: 10,
  ry: 10
})

export const day = writeLocal('day', 'day')
export const zoom = writeLocal('zoom', 'BG')
export const font = writeLocal('font', 'novel')
export const theme = writeLocal('theme', 'cinema')

export const side = writeLocal('side', 0)
export const SideBits = new Bits(
  ['Expand', 'SwipeOn', 'TimelineClock', 'Tree', 'TocOn', 'UsersOn'],
  {}
)
export { live }
