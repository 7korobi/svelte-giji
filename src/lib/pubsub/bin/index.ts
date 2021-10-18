import { socket } from '$lib/db'
import sow_village_plans from './sow-village-plans'
import progress_event from './progress-event'
import progress_story from './progress-story'

const io = socket({ sow_village_plans, progress_story, progress_event })
const port = 3001

console.log(`  local:   ws://localhost:${port}`)
io.listen(port)
