import server from '$lib/db/socket.io-server'

import * as sow_village_plans from './sow-village-plans'
import * as aggregate from './aggregate'
import * as events from './events'
import * as stories from './stories'

const io = server({ ...aggregate, ...sow_village_plans, ...stories, ...events })
const port = 3001

console.log(`  local:   ws://localhost:${port}`)
io.listen(port)
