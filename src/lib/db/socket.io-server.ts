import type { Socket, Server } from 'socket.io'
import type { ChangeStream, DeleteResult, Document, ModifyResult } from 'mongodb'
import type { DIC } from '$lib/map-reduce'
import type { BaseStoreEntry } from './socket.io-client'

import { db, watch } from './mongodb'

type ModelQuery<T, MatchArgs extends any[], MatchReturn> = {
  $match(...args: MatchArgs): MatchReturn
  query($match: MatchReturn): Promise<T[]>
}

type ModelLive<T extends Document, MatchArgs extends any[], MatchReturn> = {
  $match(...args: MatchArgs): MatchReturn
  query($match: MatchReturn): Promise<T[]>

  isLive(...args: MatchArgs): Promise<boolean>
  live($match: MatchReturn, set: (docs: T) => void, del: (id: T['_id']) => void): ChangeStream<T>

  set(doc: T): Promise<ModifyResult<T>>
  del(ids: T['_id'][]): Promise<DeleteResult>
}

type ModelEntry<T, MatchArgs extends any[], MatchReturn> =
  | ModelQuery<T, MatchArgs, MatchReturn>
  | ModelLive<T, MatchArgs, MatchReturn>

export type BaseModelEntry = ModelLive<Document, any[], Document>

let MODEL = {} as {
  [name: string]: BaseModelEntry
}
let STORE = {} as {
  [name: string]: BaseStoreEntry
}

const QUERY = {} as {
  [api: string]: {
    active?: {
      close(): void
    }
    cache?: any
  }
}

let io: Server

async function leave(socket: Socket, name: string, ...args: any[]) {
  const api = getApi(name, ...args)
  socket.leave(api)

  const sockets = await socket.to(api).allSockets()
  if (QUERY[api] && !sockets.size) {
    console.log(socket.id, api, 'closed.')
    QUERY[api].active?.close()
    delete QUERY[api].cache
    delete QUERY[api].active
  }
}

async function query(socket: Socket, name: string, ...args: any[]) {
  const api = getApi(name, ...args)
  socket.join(api)

  if (!QUERY[api]) QUERY[api] = {}

  if (QUERY[api].cache) {
    const size = QUERY[api].cache.length
    console.log(socket.id, api, `{ size: ${size} ... } (cached)`)
  } else {
    const $match = MODEL[name].$match(...args)
    QUERY[api].cache = await MODEL[name].query($match)
    const size = QUERY[api].cache.length
    console.log(socket.id, api, { size, $match })
  }

  socket.emit(`SET:${api}`, QUERY[api].cache)

  if (!MODEL[name].isLive) return
  if (!(await MODEL[name].isLive(...args))) return
  init(socket, name, api, ...args)
}

function init(socket: Socket, name: string, api: string, ...args: any[]) {
  if (!QUERY[api]) QUERY[api] = {}
  if (QUERY[api].active) return

  const $match = MODEL[name].$match(...args)
  const delay = 1000

  QUERY[api].active = MODEL[name].live($match, throttle(`SET:${api}`), throttle(`DEL:${api}`))

  function throttle<T>(key: string) {
    const items: T[] = []
    let timeout: NodeJS.Timeout

    return function (item: T) {
      if (QUERY[api].cache) delete QUERY[api].cache
      items.push(item)

      if (!timeout) timeout = setTimeout(run, delay)

      function run() {
        io.in(api).emit(key, items)
        items.length = 0
        timeout = null
      }
    }
  }
}

export function exit(name: string, ...args: any[]) {
  const api = getApi(name, ...args)

  if (!QUERY[api]) return
  if (!QUERY[api].active) return

  QUERY[api].active.close()
  delete QUERY[api].active
}

export async function set(name: string, docs: Document[]) {
  const res = await Promise.all(docs.map(MODEL[name].set))
  const errors = docs.filter((doc, idx) => !res[idx].ok)

  if (errors.length) io.in(name).emit(`SET:ERROR:${name}`, errors)
}

export async function del(name: string, ids: any[]) {
  const res = await MODEL[name].del(ids)
  const errors = res.deletedCount ? ids : []

  if (errors.length) io.in(name).emit(`DEL:ERROR:${name}`, errors)
}

export function getApi(name: string, ...args: any[]) {
  return STORE[name].qid(...args)
}

export function model<T, MatchArgs extends any[], MatchReturn>(
  o: ModelEntry<T, MatchArgs, MatchReturn>
) {
  return o
}

export function modelAsMongoDB<T extends { _id: any }>(collection: string, $project?: DIC<0 | 1>) {
  const table = () => db().collection<T>(collection)

  return {
    $match: (ids: T['_id'][]) => ({ _id: { $in: ids } }),
    set: ($set: T) => table().findOneAndUpdate({ _id: $set._id }, { $set }, { upsert: true }),
    del: (ids: T['_id'][]) => table().deleteMany({ _id: { $in: ids } }),
    isLive: async () => true,
    live: (
      $match: any,
      set: ($set: T) => Promise<ModifyResult<T>>,
      del: (ids: T['_id'][]) => Promise<DeleteResult>
    ) => watch(set, del, table, $project ? [{ $match }, { $project }] : [{ $match }]),
    query: async ($match: any) => table().find($match).toArray()
  }
}

export default function listen(
  socketio: Server,
  models: { [api: string]: ModelEntry<Document, any[], any> },
  stores: typeof STORE
) {
  MODEL = models as typeof MODEL
  STORE = stores as typeof STORE

  for (const name in stores) {
    stores[name].name = name
  }

  io = socketio
  io.on('set', set)
  io.on('del', del)
  io.on('connection', (socket) => {
    socket.on('query', query.bind(null, socket))
    socket.on('leave', leave.bind(null, socket))
  })
  console.log(io.eventNames(), io.path())
}
