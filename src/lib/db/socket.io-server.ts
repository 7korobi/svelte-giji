import type { ChangeStream, DeleteResult, Document, FindCursor, ModifyResult } from 'mongodb'
import type { BaseStoreEntry } from './socket.io-client'

import { Server, Socket } from 'socket.io'
import parser from 'socket.io-msgpack-parser'

type ModelQuery<T, MatchArgs extends any[], MatchReturn> = {
  $match(...args: MatchArgs): MatchReturn
  query($match: MatchReturn): Promise<T[]>
}

type ModelLive<IdType, T, MatchArgs extends any[], MatchReturn> = {
  $match(...args: MatchArgs): MatchReturn
  query($match: MatchReturn): Promise<T[]>

  isLive(...args: MatchArgs): Promise<boolean>
  live($match: MatchReturn, set: (docs: T) => void, del: (ids: IdType) => void): ChangeStream<T>

  set(doc: T): Promise<ModifyResult<T>>
  del(ids: IdType[]): Promise<DeleteResult>
}

type ModelEntry<IdType, T, MatchArgs extends any[], MatchReturn> =
  | ModelQuery<T, MatchArgs, MatchReturn>
  | ModelLive<IdType, T, MatchArgs, MatchReturn>

export type BaseModelEntry = ModelLive<any, Document, any[], Document>

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

const io = new Server({
  parser,
  serveClient: false,
  cors: {
    origin: ['https://admin.socket.io', 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
})

io.on('set', set)
io.on('del', del)
io.on('connection', (socket) => {
  socket.on('query', query.bind(null, socket))
})

export async function query(socket: Socket, name: string, ...args: any[]) {
  const api = getApi(name, ...args)
  socket.join(api)

  if (!QUERY[api]) QUERY[api] = {}
  console.log(api, !!QUERY[api].cache)

  if (!QUERY[api].cache) {
    const $match = MODEL[name].$match(...args)
    QUERY[api].cache = await MODEL[name].query($match)
    console.log(api, { $match, size: QUERY[api].cache.length })
  }

  socket.emit(`SET:${api}`, QUERY[api].cache)
  console.log({ rooms: socket.rooms })

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

export function model<IdType, T, MatchArgs extends any[], MatchReturn>(
  o: ModelEntry<IdType, T, MatchArgs, MatchReturn>
) {
  return o
}

export default function server(
  models: { [api: string]: ModelEntry<any, Document, any[], any> },
  stores: typeof STORE
) {
  MODEL = models as typeof MODEL
  STORE = stores as typeof STORE

  for (const name in stores) {
    stores[name].name = name
  }
  console.log(io.eventNames(), io.path())
  return io
}
