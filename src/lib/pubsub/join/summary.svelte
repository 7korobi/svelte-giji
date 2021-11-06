<script lang="ts">
import type { EVENT_ID, Story, StoryBy } from '../map-reduce'
import { groupBy } from '$lib/map-reduce'
import { Events, StorySummary } from '../client'

export let story_by: StoryBy = {}

const prologue_id = (o: Story) => `${o._id}-0` as EVENT_ID
$: story_summary_all = StorySummary.query(false)
$: event_all = Events.query($story_summary_all.list.map(prologue_id))
$: story_by =
  $event_all &&
  groupBy($story_summary_all.list, (o) =>
    event_all.find(prologue_id(o)) ? 'progress' : 'prologue'
  )
</script>
