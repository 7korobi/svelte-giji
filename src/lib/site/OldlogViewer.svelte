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
import SearchText from '$lib/inline/SearchText.svelte'

const { url } = site

export let search: RegExp
export let refresh: any = undefined
export let params = default_story_query()

$: [[folder_id], [story_id], [event_id, back_event_id, next_event_id], [], [message_id]] = book_ids(
  params.idx
)

function book_ids(id: string) {
  const id_list = subids<[FOLDER_IDX[], STORY_ID[], EVENT_ID[], string[], MESSAGE_ID[]]>(id)

  const [[, folder_idx], [, story_idx], [event_id, event_idx]] = id_list

  const pre_turns = ['top', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  const back_event_idx = event_id ? slide(pre_turns, event_idx, -1) : null
  const next_event_idx = event_id ? slide(pre_turns, event_idx, +1) : null
  const back_event_id = back_event_idx
    ? ([folder_idx, story_idx, back_event_idx].join('-') as EVENT_ID)
    : null
  const next_event_id = next_event_idx
    ? ([folder_idx, story_idx, next_event_idx].join('-') as EVENT_ID)
    : null

  id_list[2] = [event_id, back_event_id, next_event_id]
  return id_list
}

function subids<T>(id: string, separator = '-'): T {
  const idxs = id.split(separator)
  return (idxs.map((idx, at) => {
    const size = at + 1
    const sub = idxs.slice(0, size)
    return sub.length === size ? [sub.join(separator), idx] : []
  }) as any) as T
}

function slide(list: string[], idx: string, step: number): string {
  return list[list.indexOf(idx) + step]
}
</script>

<Location {refresh} bind:searchParams={params} />
<Poll {...oldlog(story_id)} />

<datalist id="search_log" />

<Report handle="footer form">
  <p>
    <SearchText bind:regexp={search} />
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
