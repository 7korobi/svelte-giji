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
import { Poll } from '$lib/storage'
import Sup from '../inline/Sup.svelte'
import Btn from '../inline/Btn.svelte'
import Grid from '../inline/Grid.svelte'
import { Location } from '$lib/uri'
import { default_story_query } from '$lib/pubsub/model-client'
import SearchText from '$lib/inline/SearchText.svelte'

const { url } = site

export let search: RegExp
export let refresh: any = undefined
export let params = default_story_query()

$: id_list = subids<[FOLDER_IDX, STORY_ID, EVENT_ID, string, MESSAGE_ID]>(params.idx)
$: folder_id = id_list[0]
$: story_id = id_list[1]
$: event_id = id_list[2]
$: message_id = id_list[4]

$: event_ids = [`${story_id}-top`, ...$oldlog_events.list.map((o) => o._id)]
$: back_event_id = slide(event_ids, event_id, -1)
$: next_event_id = slide(event_ids, event_id, +1)

$: console.log({ story_id, event_id, message_id, back_event_id, next_event_id })

function subids<T extends any[]>(id: string, separator = '-'): T {
  if (!id) return [] as T
  const idxs = id.split(separator)
  return (idxs.map((idx, at) => {
    const size = at + 1
    const sub = idxs.slice(0, size)
    return sub.length === size ? sub.join(separator) : null
  }) as any) as T
}

function slide<T>(list: T[], idx: T, step: number): T {
  return list[list.indexOf(idx) + step]
}
</script>

<Location {refresh} bind:searchParams={params} />
<Poll {...oldlog(story_id)} />

<datalist id="search_log" />

<Report handle="footer form">
  <p class="center">
    <SearchText bind:regexp={search} />
  </p>
  <p class="center">
    <span>
      <Btn as="memo" bind:value={params.mode}
        ><notebook />メモ<Sup value={$oldlog_messages.list.length} /></Btn
      >
      <Btn as="full" bind:value={params.mode}
        ><notebook />バレ<Sup value={$oldlog_messages.list.length} /></Btn
      >
      <Btn as="normal" bind:value={params.mode}
        ><notebook />通常<Sup value={$oldlog_messages.list.length} /></Btn
      >
    </span>
    <span>
      <Btn as="solo" bind:value={params.mode}
        ><notebook />独り言<Sup value={$oldlog_messages.list.length} /></Btn
      >
      <Btn as="extra" bind:value={params.mode}
        ><notebook />非日常<Sup value={$oldlog_messages.list.length} /></Btn
      >
      <Btn as="rest" bind:value={params.mode}
        ><notebook />墓休み<Sup value={$oldlog_messages.list.length} /></Btn
      >
    </span>
  </p>
  <p class="center">
    {#if oldlog_events.find(back_event_id)}
      <Btn as={back_event_id} bind:value={params.idx}
        >{oldlog_events.find(back_event_id).name}へ戻る</Btn
      >
    {/if}
    {#if oldlog_events.find(next_event_id)}
      <Btn as={next_event_id} bind:value={params.idx}
        >{oldlog_events.find(next_event_id).name}へ進む</Btn
      >
    {/if}
  </p>
</Report>

<style lang="scss">
</style>
