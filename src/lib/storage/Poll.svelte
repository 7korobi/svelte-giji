<script lang="ts">
import type { WebPollData } from './dexie'

import { onDestroy } from 'svelte'
import { webPoll } from './dexie'
import { to_tempo, Tempo } from '$lib/timer'
import { INTERVAL_MAX } from '$lib/timer'
import browser from '$lib/browser'
import { __BROWSER__ } from '$lib/browser/device'

const { isActive } = browser

export let version = '1.0.0'
export let timer = '1d'
export let shift = '0s'
export let idx = ''

// for export.
export let onFetch = (pack) => {}
export let pack: any = undefined
export let next_at = -Infinity

// for requesting.
export let api_call = async () => {
  const req = await fetch(idx)
  pack = await req.json()
  return { version, idx, pack } as WebPollData<any>
}

let timerId = 0 as any

$: tempo = to_tempo(timer, shift)
$: restart($isActive)
$: if (pack) onFetch(pack)

function restart(is_active: boolean) {
  if (is_active) {
    tick()
  } else {
    clearTimeout(timerId)
  }
}

onDestroy(() => {
  clearTimeout(timerId)
})

function logger(tempo: Tempo, mode: string = '') {
  const wait = new Date().getTime() - tempo.write_at
  console.log({ wait, idx, mode })
}

async function tick() {
  if (!webPoll) return
  tempo = tempo.reset()
  try {
    if (tempo.write_at < next_at) {
      logger(tempo)
    } else {
      // IndexedDB metadata not use if memory has past data,
      const data = await webPoll.data.get(idx)
      if (data && data.version === version) {
        get_by_cache(tempo, data)
        if (data.next_at <= tempo.write_at) {
          await get_by_api(tempo, await api_call())
        }
      } else {
        await get_by_api(tempo, await api_call())
      }
    }
    next_at = tempo.next_at
  } catch (e) {
    console.error({ idx, version }, e)
  }
  if (tempo.timeout < INTERVAL_MAX) {
    // 25days
    timerId = setTimeout(tick, tempo.timeout)
  }
}

function get_by_cache(tempo: Tempo, cache: WebPollData<any>) {
  pack = cache.pack
  logger(tempo, '(cache)')
}

async function get_by_api(tempo: Tempo, api: WebPollData<any>) {
  pack = api.pack

  api.next_at = tempo.next_at
  api.next_time = new Date(tempo.next_at).toLocaleString()
  await webPoll.data.put(api)
  logger(tempo, '(api)')
}
</script>

<div />
