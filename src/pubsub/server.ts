import server from '$lib/db/socket.io-server'

import * as stores from './store'
import * as models from './bin'

const io = server(models, stores)
const port = 3001

console.log(`  local:   ws://localhost:${port}`)
io.listen(port)
