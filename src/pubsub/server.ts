import server from '$lib/db/socket.io-server'
import { dbBoot } from '$lib/db'

import * as stores from './store'
import * as models from './bin'

dbBoot(`mongodb://giji-api.duckdns.org:27017/giji?directConnection=true&replicaSet=giji`)

const io = server(models, stores)
const port = 3001

console.log(`  local:   ws://localhost:${port}`)
io.listen(port)
