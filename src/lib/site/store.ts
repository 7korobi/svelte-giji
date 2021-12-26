import { derived, writable } from 'svelte/store'

import { writeHistory } from '$lib/storage'
import { writeLocal } from '$lib/storage'
import { __BROWSER__ } from '$lib/browser-device'
import { Bits } from '$lib/design/bits'

type Topic = {
  page: {
    path: string
  }
  label: string
  title: string
}

const initialState = {
  topics: [] as Topic[]
}

export const url = writable({
  portrate: '/images/portrate/',
  icon: '/images/icon/',
  css: '/css/',
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

export const topics = writeHistory(initialState.topics, (o) => o.page.path)

export const sameSites = writable(__BROWSER__ ? [location.origin] : [])
export const regSites = derived([sameSites], ([$sameSites], set: (reg: RegExp) => void) => {
  const reg = new RegExp(`^${$sameSites.join('|^')}`)
  set(reg)
})
