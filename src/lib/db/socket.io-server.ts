import type { ChangeStream, DeleteResult, Document, FindCursor, ModifyResult } from 'mongodb'
import type { DocumentId } from './type'

import { Server, Socket } from 'socket.io'
import parser from 'socket.io-msgpack-parser'

const QUERY = {} as {
  [qid: string]: {
    active?: {
      close(): void
    }
    cache?: any
  }
}

let MODEL = {} as {
  [api: string]: ModelLive<DocumentId, Document, any[], Document>
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

export async function query(socket: Socket, api: string, ...args: any[]) {
  const qid = getQid(api, ...args)
  socket.join(api)

  if (!QUERY[qid]) QUERY[qid] = {}
  console.log(qid, !!QUERY[qid].cache)

  if (!QUERY[qid].cache) {
    const $match = MODEL[api].$match(...args)
    QUERY[qid].cache = await MODEL[api].query($match).toArray()
  }

  socket.emit(`SET:${api}`, QUERY[qid].cache)
  console.log({ rooms: socket.rooms })

  if (await MODEL[api].isLive(...args)) init(socket, api, ...args)
}

function init(socket: Socket, api: string, ...args: any[]) {
  const qid = getQid(api, ...args)

  if (!QUERY[qid]) QUERY[qid] = {}
  if (QUERY[qid].active) return

  console.log('')

  const $match = MODEL[api].$match(...args)
  const delay = 1000

  QUERY[qid].active = MODEL[api].live($match, throttle(`SET:${api}`), throttle(`DEL:${api}`))

  function throttle<T>(key: string) {
    const items: T[] = []
    let timeout: NodeJS.Timeout

    return function (item: T) {
      if (QUERY[qid].cache) delete QUERY[qid].cache
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

export function exit(api: string, ...args: any[]) {
  const qid = getQid(api, ...args)

  if (!QUERY[qid]) return
  if (!QUERY[qid].active) return

  QUERY[qid].active.close()
  delete QUERY[qid].active
}

export async function set(api: string, docs: Document[]) {
  const res = await Promise.all(docs.map(MODEL[api].set))
  const errors = docs.filter((doc, idx) => !res[idx].ok)

  if (errors.length) io.in(api).emit(`SET:ERROR:${api}`, errors)
}

export async function del(api: string, ids: DocumentId[]) {
  const res = await MODEL[api].del(ids)
  const errors = res.deletedCount ? ids : []

  if (errors.length) io.in(api).emit(`DEL:ERROR:${api}`, errors)
}

export function getQid(api: string, ...args: any[]) {
  return `${api}:${MODEL[api].qid(...args)}`
}

type ModelQuery<T, MatchArgs extends any[], MatchReturn> = {
  $match(...args: MatchArgs): MatchReturn
  qid(...args: MatchArgs): string
  query($match: MatchReturn): FindCursor<T>
}

type ModelLive<IdType, T, MatchArgs extends any[], MatchReturn> = {
  $match(...args: MatchArgs): MatchReturn
  qid(...args: MatchArgs): string
  query($match: MatchReturn): FindCursor<T>

  isLive(...args: MatchArgs): Promise<boolean>
  live($match: MatchReturn, set: (docs: T) => void, del: (ids: IdType) => void): ChangeStream<T>

  set(doc: T): Promise<ModifyResult<T>>
  del(ids: IdType[]): Promise<DeleteResult>
}

type ModelEntry<IdType, T, MatchArgs extends any[], MatchReturn> =
  | ModelQuery<T, MatchArgs, MatchReturn>
  | ModelLive<IdType, T, MatchArgs, MatchReturn>

export function model<IdType, T, MatchArgs extends any[], MatchReturn>(
  o: ModelEntry<IdType, T, MatchArgs, MatchReturn>
) {
  return o
}

export default function server(m: { [api: string]: ModelEntry<DocumentId, Document, any[], any> }) {
  MODEL = m as typeof MODEL
  console.log(io.eventNames(), io.path())
  return io
}
