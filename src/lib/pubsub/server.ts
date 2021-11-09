import { readFileSync } from 'fs'
import * as https from 'https'
import { Server } from 'socket.io'
import parser from 'socket.io-msgpack-parser'

import server from '$lib/db/socket.io-server'
import { dbBoot } from '$lib/db'

import * as stores from './model-client'
import * as models from './model-server'
import { argv } from 'process'
import { site } from '$lib/store'

const mode = argv.pop()
const bootstrap = { dev, prod }

bootstrap[mode]()

function dev() {
  dbBoot(site.live.db.mongodb)
  const io = new Server({
    parser,
    serveClient: false,
    cors: {
      origin: ['http://localhost:3000', 'https://giji-db923.web.app'],
      methods: ['GET', 'POST']
    }
  })

  server(io, models, stores)
  io.listen(3001)
}

function prod() {
  const key = readFileSync(`../../giji/giji/config/https/dev-server-key.pem`)
  const cert = readFileSync(`../../giji/giji/config/https/dev-server-cert.pem`)

  dbBoot(site.live.db.mongodb)

  const listener = https.createServer({ key, cert })
  const io = new Server(listener, {
    parser,
    serveClient: false,
    cors: {
      origin: ['https://admin.socket.io', 'https://giji.f5.si', 'https://giji-db923.web.app'],
      methods: ['GET', 'POST']
    }
  })

  server(io, models, stores)
  listener.listen(3001)
}
