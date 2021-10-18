import eiows from 'eiows'
import { Server } from 'socket.io'
import parser from 'socket.io-msgpack-parser'

import type { ObjectId, Document } from 'mongodb'
import type { ModelEntry } from './type'

type QueryEntry = {
  active?: {
    close(): void
  }
  cache?: any
}

const QUERY = {} as { [qid: string]: QueryEntry }
let MODEL = {} as {
  [api: string]: ModelEntry<any[], ObjectId, Document, Document>
}

const io = new Server({
  wsEngine: eiows.Server,
  parser,
  serveClient: false,
  cors: {
    origin: ['https://admin.socket.io', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header']
  }
})

io.on('query', query)
io.on('set', set)
io.on('del', del)
io.on('connection', (socket) => {
  console.log(socket.id)
})

export default function (m: typeof MODEL) {
  MODEL = m
  return io
}

export function getQid(api: string, ...args) {
  return `${api}:${MODEL[api].qid(...args)}`
}

export async function query(id: string, api: string, ...args) {
  const qid = getQid(api, ...args)

  if (!QUERY[qid]) QUERY[qid] = {}
  if (!QUERY[qid].cache) {
    const $match = MODEL[api].$match(...args)
    QUERY[qid].cache = await MODEL[api].query($match)
  }

  io.to(id).emit(`SET:${api}`, QUERY[qid].cache)
  io.to(id).socketsJoin(api)

  if (await MODEL[api].isLive(...args)) init(api, ...args)
}

function init(api: string, ...args) {
  const qid = getQid(api, ...args)

  if (!QUERY[qid]) QUERY[qid] = {}
  if (QUERY[qid].active) return

  const $match = MODEL[api].$match(...args)
  QUERY[qid].active = MODEL[api].live(
    $match,
    (docs) => {
      if (QUERY[qid].cache) delete QUERY[qid].cache
      io.in(api).emit(`SET:${api}`, docs)
    },
    (ids) => {
      if (QUERY[qid].cache) delete QUERY[qid].cache
      io.in(api).emit(`DEL:${api}`, ids)
    }
  )
}

export function exit(api: string, ...args) {
  const qid = getQid(api, ...args)

  if (!QUERY[qid]) return
  if (!QUERY[qid].active) return

  QUERY[qid].active.close()
  delete QUERY[qid].active
}

export async function set(api: string, docs) {
  const { errors } = await MODEL[api].set(docs)
  if (errors.length) io.in(api).emit(`SET:ERROR:${api}`, errors)
}

export async function del(api: string, ids) {
  const { errors } = await MODEL[api].del(ids)
  if (errors.length) io.in(api).emit(`DEL:ERROR:${api}`, errors)
}
