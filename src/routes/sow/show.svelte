<script lang="ts">
import type { BookMessage } from '$lib/pubsub/map-reduce'
import { page } from '$app/stores'
import { default_story_query } from '$lib/pubsub/model-client'
import { Pager } from '$lib/scroll'
import {
  oldlog_stories,
  oldlog_events,
  oldlog_potofs,
  oldlog_cards,
  oldlog_stats
} from '$lib/pubsub/poll'

import { Chat } from '$lib/site/chat'
import OldlogViewer from '$lib/site/chats/oldlog-viewer.svelte'

let regexp = /^/g
let params = default_story_query()
let messages
let last_page: number
let next_page: number

$: console.log('oldlog_stories', $oldlog_stories)
$: console.log('oldlog_events', $oldlog_events)
$: console.log('oldlog_potofs', $oldlog_potofs)
$: console.log('oldlog_cards', $oldlog_cards)
$: console.log('oldlog_stats', $oldlog_stats)
</script>

<svelte:head>
  <title>終了した村</title>
</svelte:head>

<OldlogViewer refresh={$page} bind:regexp bind:params bind:messages />

<Pager
  chunk={20}
  bind:last_page
  bind:next_page
  list={messages || []}
  bind:focus={params.idx}
  let:item={{ _id, show, handle, face_id, deco, log, to, name, story }}
>
  <Chat {...{ _id, show, handle, face_id, deco, log, to, name, story }} />
</Pager>

<div s="TimelineClock" class="inframe mentions">
  <div class="stable SSAY">
    <hr />
    <strong class="fine text"
      ><!---->
      <p class="left">by mzsn</p>
      <p class="left" style="white-space: nowrap;">
        <abbr title="クリップボードへコピー" class="btn">(&gt;&gt;0:29 アリババ)</abbr>
      </p>
      <p class="right">
        <span class="pull-left">プロローグ p4</span><time>2ヶ月前</time>
      </p>
      <p class="right">
        <span>会話</span><span title="クリップボードへコピー"><abbr class="btn">0:29</abbr></span>
      </p></strong
    >
  </div>
</div>
