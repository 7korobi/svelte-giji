import Dexie from 'dexie'
import { __BROWSER__ } from 'svelte-petit-utils'

export type WebPollData<T> = {
  version: string
  idx: string
  next_at?: number
  next_time?: string
  pack: T
}
class WebPoll extends Dexie {
  data!: Dexie.Table<WebPollData<any>, string>
}

export let webPoll: WebPoll = null as any

if (__BROWSER__) {
  webPoll = new Dexie('poll-web') as WebPoll
  webPoll.version(1).stores({
    data: '&idx'
  })
}
