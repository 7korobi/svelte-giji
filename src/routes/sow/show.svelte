<script lang="ts">
import { page } from '$app/stores'
import { default_story_query } from '$lib/pubsub/model-client'
import {
  oldlog_stories,
  oldlog_events,
  oldlog_potofs,
  oldlog_messages,
  oldlog_cards,
  oldlog_stats
} from '$lib/pubsub/poll'

import OldlogViewer from '$lib/site/chats/oldlog-viewer.svelte'

let search = /^/g
let params = default_story_query()

$: console.log('oldlog_stories', $oldlog_stories)
$: console.log('oldlog_events', $oldlog_events)
$: console.log('oldlog_messages', $oldlog_messages)
$: console.log('oldlog_potofs', $oldlog_potofs)
$: console.log('oldlog_cards', $oldlog_cards)
$: console.log('oldlog_stats', $oldlog_stats)
</script>

<OldlogViewer refresh={$page} bind:search bind:params />
