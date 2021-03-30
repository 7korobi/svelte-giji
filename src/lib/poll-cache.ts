import Dexie from 'dexie'
import { __BROWSER__ } from './device'

type DATA<T> = { idx: string; pack: T }
type META = { idx: string; version: string; next_at: number }

class PollWeb extends Dexie {
  meta!: Dexie.Table<META, string>
  data!: Dexie.Table<DATA<any>, string>
}

export let dexie: PollWeb = null as any

if (__BROWSER__) {
  dexie = new Dexie('poll-web') as PollWeb
  dexie.version(1).stores({
    meta: '&idx',
    data: '&idx'
  })
}
