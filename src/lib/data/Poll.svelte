<script lang="ts">
import { onDestroy } from 'svelte'

import { to_tempo, Tempo } from '$lib/time'
import { __BROWSER__ } from '$lib/device'
import { dexie } from '$lib/poll-cache'

type DATA = {
  idx: string
  pack: any
}

export let api = apiNop
export let store = storeNop
export let version = '1.0.0'
export let timer = '1d'
export let args = []
export let pack: any = undefined
export let isActive = false

let idx = [api.name, args.join('/')].join('&')

// in roop vars.
let tempo = to_tempo(timer)
let next_at = -Infinity
let timerId = 0 as any

$: if (isActive) {
  roop()
} else {
  clearTimeout(timerId)
}

onDestroy(() => {
  clearTimeout(timerId)
})

async function apiNop(...args: any[]): Promise<DATA> {
  return {
    idx: '',
    pack: args
  }
}

function storeNop(data: DATA['pack']) {
  data
}

function logger(write_at: number, mode: string = '') {
  const wait = new Date().getTime() - write_at
  console.log({ wait, idx, mode })
}

async function roop() {
  tempo = tempo.reset()
  try {
    if (tempo.write_at < next_at) {
      get_pass(tempo)
    } else {
      // IndexedDB metadata not use if memory has past data,
      const meta_next_at = await chk_meta(version, next_at)
      if (tempo.write_at < meta_next_at) {
        await get_by_lf(tempo, store)
      } else if (-Infinity < meta_next_at) {
        await get_by_lf(tempo, store)
        const data = await api(...args)
        await get_by_api(tempo, data)
      } else {
        const data = await api(...args)
        await get_by_api(tempo, data)
        dexie.meta.put({ idx, version, next_at: tempo.next_at })
      }
    }
    next_at = tempo.next_at
  } catch (e) {
    console.error(e)
  }
  if (tempo.timeout < 0x7fffffff) {
    // 25days
    timerId = setTimeout(roop, tempo.timeout)
  }
}

async function chk_meta(version: string, next_at: number) {
  if (-Infinity < next_at) {
    return next_at
  }
  if (dexie) {
    const meta = await dexie.meta.get(idx)
    if (meta && meta.version === version) {
      return meta.next_at
    }
  }
  return -Infinity
}

async function get_pass({ write_at }: Tempo) {
  logger(write_at)
}

async function get_by_lf({ write_at }: Tempo, store: (data: DATA) => void) {
  if (dexie) {
    const data: DATA = await dexie.data.get(idx)
    if (data) {
      store(data)
      pack = data.pack
    }
  }
  logger(write_at, '(lf)')
}

async function get_by_api({ write_at }: Tempo, data: DATA) {
  if (dexie) {
    data.idx = idx
    await dexie.data.put(data)
    pack = data.pack
  }
  logger(write_at, '(api)')
}
</script>
