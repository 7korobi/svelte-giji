<script lang="ts">
import { page } from '$app/stores'
import { default_story_query } from '$lib/pubsub/model-client'
import { Pager } from 'svelte-scroll-observe'
import {
  oldlog_stories,
  oldlog_events,
  oldlog_potofs,
  oldlog_cards,
  oldlog_stats
} from '$lib/pubsub/poll'

import { Banner, Chat } from '$lib/site/chat'
import OldlogViewer from '$lib/site/chats/oldlog-viewer.svelte'
import { sideframe, toastframe } from '$lib/site/store'

let regexp = /^/g
let params = default_story_query()
let messages
let now_page: number

$: console.log('oldlog_stories', $oldlog_stories)
$: console.log('oldlog_events', $oldlog_events)
$: console.log('oldlog_potofs', $oldlog_potofs)
$: console.log('oldlog_cards', $oldlog_cards)
$: console.log('oldlog_stats', $oldlog_stats)
</script>

<svelte:head>
  <title>終了した村</title>
</svelte:head>

<OldlogViewer refresh={$page} page={now_page} bind:regexp bind:params bind:messages>
  <Pager
    chunk={20}
    list={messages || []}
    bind:page={now_page}
    bind:focus={params.idx}
    id={(item) => item._id}
    base={(item) => item.event_id}
    let:item
  >
    {@const { _id, show, handle, face_id, deco, log, to, name, story, phase } = item}
    <Banner slot="page" let:page>{`p${page}`}</Banner>
    <Chat {...{ _id, show, handle, face_id, deco, log, to, name, story, phase }} />
  </Pager>
</OldlogViewer>

<div use:toastframe.mount />
<div use:sideframe.mount />
