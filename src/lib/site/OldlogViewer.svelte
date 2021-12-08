<script lang="ts">
import type {
  FOLDER_IDX,
  STORY_ID,
  STORY_IDX,
  EVENT_ID,
  EVENT_IDX,
  MESSAGE_ID,
  MESSAGE_IDX
} from '$lib/pubsub/map-reduce'
import {
  oldlog,
  oldlog_stories,
  oldlog_events,
  oldlog_potofs,
  oldlog_messages
} from '$lib/pubsub/poll'
import { Erase } from '$lib/icon'
import site from '$lib/site'
import { Post, Report } from '$lib/chat'
import Poll from '$lib/storage/Poll.svelte'
import Sup from '../inline/Sup.svelte'
import Btn from '../inline/Btn.svelte'
import Grid from '../inline/Grid.svelte'
import { Location } from '$lib/uri'
import { default_story_query } from '$lib/pubsub/model-client'

const { url } = site
const pre_turns = ['top', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

export let refresh: any = undefined
export let hash = ''
export let params = default_story_query()

$: idx_ary = params.idx.split('-')
$: folder_id = subid(idx_ary, 1) as FOLDER_IDX
$: story_id = subid(idx_ary, 2) as STORY_ID
$: message_id = subid(idx_ary, 5) as MESSAGE_ID

$: event_id = subid(idx_ary, 3) as EVENT_ID
$: back_event_idx = event_id ? slide(pre_turns, idx_ary[2], -1) : null
$: next_event_idx = event_id ? slide(pre_turns, idx_ary[2], +1) : null
$: back_event_id = back_event_idx
  ? ([idx_ary[0], idx_ary[1], back_event_idx].join('-') as EVENT_ID)
  : null
$: next_event_id = next_event_idx
  ? ([idx_ary[0], idx_ary[1], next_event_idx].join('-') as EVENT_ID)
  : null

function slide(list: string[], idx: string, step: number): string {
  return list[list.indexOf(idx) + step]
}
function subid(list: string[], size: number): string {
  const sub = list.slice(0, size)
  return sub.length === size ? sub.join('-') : null
}
</script>

<Location {refresh} bind:hash bind:searchParams={params} />
<Poll {...oldlog(story_id)} />

<datalist id="search_log" />

<Report handle="footer form">
  <p>
    <label for="search"><Search /></label>
    <input id="search" class="search" size="30" list="search_log" />
  </p>
  <p class="center">
    <span>
      <Btn as="memo" bind:value={params.mode}
        ><Notebook />メモ<Sup value={$oldlog_messages.list.length} /></Btn
      >
      <Btn as="full" bind:value={params.mode}
        ><Notebook />バレ<Sup value={$oldlog_messages.list.length} /></Btn
      >
      <Btn as="normal" bind:value={params.mode}
        ><Notebook />通常<Sup value={$oldlog_messages.list.length} /></Btn
      >
    </span>
    <span>
      <Btn as="solo" bind:value={params.mode}
        ><Notebook />独り言<Sup value={$oldlog_messages.list.length} /></Btn
      >
      <Btn as="extra" bind:value={params.mode}
        ><Notebook />非日常<Sup value={$oldlog_messages.list.length} /></Btn
      >
      <Btn as="rest" bind:value={params.mode}
        ><Notebook />墓休み<Sup value={$oldlog_messages.list.length} /></Btn
      >
    </span>
  </p>
  <p>
    <Btn as={back_event_id} bind:value={params.idx}
      >{oldlog_events.find(back_event_id).name}へ戻る</Btn
    >
    <Btn as={next_event_id} bind:value={params.idx}
      >{oldlog_events.find(next_event_id).name}へ進む</Btn
    >
  </p>
</Report>

<style lang="scss">
</style>
