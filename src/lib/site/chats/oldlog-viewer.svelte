<script lang="ts">
import type {
  BOOK_FOLDER_IDX,
  BOOK_STORY_ID,
  BOOK_EVENT_ID,
  BOOK_MESSAGE_ID,
  BookMessage
} from '$lib/pubsub/map-reduce'
import {
  oldlog,
  oldlog_events,
  oldlog_messages,
  memo_oldlog_messages,
  full_oldlog_messages,
  normal_oldlog_messages,
  solo_oldlog_messages,
  extra_oldlog_messages,
  rest_oldlog_messages,
  oldlog_potofs,
  oldlog_cards,
  oldlog_stats
} from '$lib/pubsub/poll'
import Poll from '$lib/storage/poll.svelte'
import { Location } from '$lib/uri'
import { default_story_query } from '$lib/pubsub/model-client'
import { Sup, Btn, SearchText } from '$lib/design'

import * as site from '../store'
import { Talk, Post, Report } from '../chat'

const { url } = site

export let messages: BookMessage[]
export let regexp: RegExp
export let refresh: any = undefined
export let params = default_story_query()

$: [folder_id, story_id, event_id, phase_id, message_id] = subids<
  [BOOK_FOLDER_IDX, BOOK_STORY_ID, BOOK_EVENT_ID, string, BOOK_MESSAGE_ID]
>(params.idx)
$: event_ids = $oldlog_events.list.map((o) => o._id)
$: back_event_id = slide(event_ids, event_id, -1)
$: next_event_id = slide(event_ids, event_id, +1)

$: memo_messages = memo_oldlog_messages()
$: full_messages = full_oldlog_messages()
$: normal_messages = normal_oldlog_messages()
$: solo_messages = solo_oldlog_messages()
$: extra_messages = extra_oldlog_messages()
$: rest_messages = rest_oldlog_messages()

$: switch (params.mode) {
  case 'memo':
    messages = $memo_messages.event[event_id]
    break
  case 'full':
    messages = $full_messages.event[event_id]
    break
  case 'normal':
    messages = $normal_messages.event[event_id]
    break
  case 'solo':
    messages = $solo_messages.event[event_id]
    break
  case 'extra':
    messages = $extra_messages.event[event_id]
    break
  case 'rest':
    messages = $rest_messages.event[event_id]
    break
}

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

function label(event_id: BOOK_EVENT_ID) {
  const event = oldlog_events.find(event_id)
  if (!event) return ''

  return `${event.name}へ`
}
</script>

<Location {refresh} bind:searchParams={params} />
<Poll {...oldlog(story_id)} />

<Report handle="footer form">
  <p class="center">
    <SearchText bind:value={params.search} bind:regexp />
  </p>
  <p class="center">
    <span>
      <Btn as="memo" bind:value={params.mode} disabled={!$memo_messages.event[event_id]?.length}
        ><notebook />メモ<Sup value={$memo_messages.event[event_id]?.length} /></Btn
      >
      <Btn as="full" bind:value={params.mode} disabled={!$full_messages.event[event_id]?.length}
        ><notebook />バレ<Sup value={$full_messages.event[event_id]?.length} /></Btn
      >
      <Btn as="normal" bind:value={params.mode} disabled={!$normal_messages.event[event_id]?.length}
        ><notebook />通常<Sup value={$normal_messages.event[event_id]?.length} /></Btn
      >
    </span>
    <span>
      <Btn as="solo" bind:value={params.mode} disabled={!$solo_messages.event[event_id]?.length}
        ><notebook />独り言<Sup value={$solo_messages.event[event_id]?.length} /></Btn
      >
      <Btn as="extra" bind:value={params.mode} disabled={!$extra_messages.event[event_id]?.length}
        ><notebook />非日常<Sup value={$extra_messages.event[event_id]?.length} /></Btn
      >
      <Btn as="rest" bind:value={params.mode} disabled={!$rest_messages.event[event_id]?.length}
        ><notebook />墓休み<Sup value={$rest_messages.event[event_id]?.length} /></Btn
      >
    </span>
  </p>
  <p class="center">
    <Btn as={back_event_id} bind:value={params.idx} disabled={!label(back_event_id)}
      >{label(back_event_id)}戻る</Btn
    >
    <Btn as={next_event_id} bind:value={params.idx} disabled={!label(next_event_id)}
      >{label(next_event_id)}進む</Btn
    >
  </p>
</Report>

<style lang="scss">
</style>
