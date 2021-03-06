import { readFileSync } from 'fs'
import * as https from 'https'
import { Server } from 'socket.io'
import parser from 'socket.io-msgpack-parser'

import server from '$lib/db/socket.io-server'
import { dbBoot } from '$lib/db'

import json from '../site/json/live-server.json'
import * as stores from './model-client'
import * as models from './model-server'

const bootstrap = { dev, prod }

const OPTIONS = [
  process.env.pm_id,
  process.env.NODE_ENV,
  process.env.autorestart,
  process.env.exec_mode
]

console.log(OPTIONS)
bootstrap[process.env.NODE_ENV ?? 'dev']()

function dev() {
  const conf = json.dev
  dbBoot(conf.mongodb)
  const io = new Server({
    parser,
    serveClient: false,
    cors: {
      origin: conf.io.origin,
      methods: ['GET', 'POST']
    }
  })

  server(io, models, stores)
  io.listen(conf.http.port)
}

function prod() {
  const conf = json.prod
  const key = readFileSync(conf.https.privkey)
  const cert = readFileSync(conf.https.cert)

  dbBoot(conf.mongodb)

  const listener = https.createServer({ key, cert })
  const io = new Server(listener, {
    parser,
    serveClient: false,
    cors: {
      origin: conf.io.origin,
      methods: ['GET', 'POST']
    }
  })

  server(io, models, stores)
  listener.listen(conf.https.port)
}
