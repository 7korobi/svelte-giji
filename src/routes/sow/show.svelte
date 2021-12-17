<script lang="ts">
import { page } from '$app/stores'
import OldlogViewer from '$lib/site/OldlogViewer.svelte'
import { default_story_query } from '$lib/pubsub/model-client'
import {
  oldlog,
  oldlog_stories,
  oldlog_events,
  oldlog_potofs,
  oldlog_messages
} from '$lib/pubsub/poll'

let search = ''
let params = default_story_query()

$: console.log({
  oldlog_stories: $oldlog_stories,
  oldlog_events: $oldlog_events,
  oldlog_potofs: $oldlog_potofs,
  oldlog_messages: $oldlog_messages
})
</script>

<OldlogViewer refresh={$page} bind:search bind:params />
