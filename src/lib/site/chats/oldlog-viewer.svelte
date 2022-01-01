<script lang="ts">
import type { BOOK_EVENT_ID, BookMessage } from '$lib/pubsub/map-reduce'
import { Phases } from '$lib/pubsub/map-reduce'
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
  oldlog_potofs
} from '$lib/pubsub/poll'
import { __BROWSER__ } from '$lib/common'
import { Location } from '$lib/uri'
import { Sup, Btn, SearchText } from '$lib/design'

import Poll from '$lib/storage/poll.svelte'
import { Talk, Post, Report } from '../chat'

import { default_story_query } from '$lib/pubsub/model-client'
import { book_ids } from '$lib/pubsub/book/query'

import { side, SideBits, summaryframe } from '$lib/site/store'
import MessageAppendix from '$lib/site/summary-frame/message-appendix.svelte'
import PotofTable from '$lib/site/summary-frame/potof-table.svelte'

export let page: number
export let messages: BookMessage[]
export let regexp: RegExp
export let refresh: any = undefined
export let params = default_story_query()
export let onReset = () => window.scrollTo(0, 0)

$: [[, story_id, event_id, , message_id], [, , , phase_idx]] = book_ids(params.idx)
$: event_ids = $oldlog_events.list.map((o) => o._id)
$: event_at = event_ids.indexOf(event_id)

$: event = $oldlog_events && oldlog_events.find(event_id)
$: phase = Phases.find(phase_idx)
$: message = $oldlog_messages && oldlog_messages.find(message_id)
$: memo_messages = memo_oldlog_messages(regexp)
$: full_messages = full_oldlog_messages(regexp)
$: normal_messages = normal_oldlog_messages(regexp)
$: solo_messages = solo_oldlog_messages(regexp)
$: extra_messages = extra_oldlog_messages(regexp)
$: rest_messages = rest_oldlog_messages(regexp)

$: console.log('memo_oldlog_messages', regexp, $memo_messages)
$: console.log('full_oldlog_messages', regexp, $full_messages)
$: console.log('normal_oldlog_messages', regexp, $normal_messages)
$: console.log('solo_oldlog_messages', regexp, $solo_messages)
$: console.log('extra_oldlog_messages', regexp, $extra_messages)
$: console.log('rest_oldlog_messages', regexp, $rest_messages)

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
$: story_id && event_id && __BROWSER__ && onReset()
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
    <Btn
      as={event_ids[event_at - 1]}
      bind:value={params.idx}
      disabled={!label(event_ids[event_at - 1])}>{label(event_ids[event_at - 1])}戻る</Btn
    >
    <Btn
      as={event_ids[event_at + 1]}
      bind:value={params.idx}
      disabled={!label(event_ids[event_at + 1])}>{label(event_ids[event_at + 1])}進む</Btn
    >
  </p>
</Report>

<slot />

<Report handle="footer form">
  <p class="center">
    <Btn
      as={event_ids[event_at - 1]}
      bind:value={params.idx}
      disabled={!label(event_ids[event_at - 1])}>{label(event_ids[event_at - 1])}戻る</Btn
    >
    <Btn
      as={event_ids[event_at + 1]}
      bind:value={params.idx}
      disabled={!label(event_ids[event_at + 1])}>{label(event_ids[event_at + 1])}進む</Btn
    >
  </p>
</Report>

<div use:summaryframe.mount>
  <MessageAppendix {message} {phase} {event} {page} />

  <PotofTable potofs={$oldlog_potofs.list} />
</div>

<style lang="scss">
</style>
