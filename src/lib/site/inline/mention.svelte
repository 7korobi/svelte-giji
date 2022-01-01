<script lang="ts">
import { Phases } from '$lib/pubsub/map-reduce'

export let id
export let base_id = id

let mention: string

$: [folder_idx, story_idx, event_idx, phase_idx, message_idx] = id.split('-')
$: phase = Phases.find(phase_idx) || Phases.find('DEL')
$: is_near = `${folder_idx}-${story_idx}-${event_idx}` === base_id.split('-').slice(0, 3).join('-')

$: if (null === phase.mark) {
  mention = `${is_near ? '' : `${event_idx}-`}${phase_idx}-${message_idx}`
} else {
  mention = `${phase.mark}${is_near ? '' : `${event_idx}:`}${message_idx}`
}
</script>

{#if phase.is_show}
  <q cite=""><slot {mention} /></q>
{/if}
