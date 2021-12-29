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

import { Talk, Post, Report } from '../chat'
import { url, side, SideBits, summaryframe } from '$lib/site/store'
import Mention from '$lib/site/inline/mention.svelte'
import { Time } from '$lib/timer'
import { portals } from '$lib/common'

export let page: number
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

$: event = $oldlog_events && oldlog_events.find(event_id)
$: message = $oldlog_messages && oldlog_messages.find(message_id)
$: memo_messages = memo_oldlog_messages(regexp)
$: full_messages = full_oldlog_messages(regexp)
$: normal_messages = normal_oldlog_messages(regexp)
$: solo_messages = solo_oldlog_messages(regexp)
$: extra_messages = extra_oldlog_messages(regexp)
$: rest_messages = rest_oldlog_messages(regexp)

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

function clip(e: MouseEvent) {
  const range = document.createRange()
  range.selectNode(e.target as Node)
  window.getSelection().addRange(range)
  document.execCommand('copy')
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

<div use:summaryframe.mount>
  {#if message && event && $side & SideBits.posi.TimelineClock}
    <div class="inframe mentions">
      <div class="stable SSAY">
        <hr />
        <strong class="fine text"
          ><!---->
          <p class="left">by {message.potof?.sow_auth_id || '???'}</p>
          <p class="left" style="white-space: nowrap;">
            <button title="クリップボードへコピー" on:click={clip} cite={message._id}>
              <Mention id={message._id} let:mention
                >(<b>&gt;&gt;</b>{mention} {message.face?.name || ''})</Mention
              >
            </button>
          </p>
          <p class="right">
            <span class="pull-left">{event.name} p{page}</span><Time at={message.write_at} />
          </p>
          <p class="right">
            <span>会話</span><span title="クリップボードへコピー"
              ><abbr class="btn">0:29</abbr></span
            >
          </p></strong
        >
      </div>
    </div>
  {/if}

  {#if $side & SideBits.posi.UsersOn}
    <div class="inframe header">
      <div class="swipe">
        <table>
          <tfoot class="TITLE form tb-btn">
            <!-- svelte-ignore a11y-missing-attribute -->
            <tr>
              <th colspan="3"><sup>(スクロールします)</sup></th>
              <th><a class="active">日程</a></th>
              <th><a class="btn">状態</a></th>
              <th><a class="btn">促</a></th>
              <th colspan="2">
                <a class="btn">回数</a>
                <a class="btn" title="字数 ÷ 回数">平均</a>
                <a class="btn">字数</a>
                <a class="btn" title="字数 ÷ 範囲">密度</a></th
              >
              <th>
                <a class="btn">最初</a>
                <a class="btn" title="最後 － 最初">範囲</a>
                <a class="btn">最後</a></th
              >
              <th> <a class="btn">勝敗</a></th>
              <th colspan="2">
                <a class="btn">陣営</a>
                <a class="btn">役割</a></th
              >
              <th><a class="btn">希望</a></th>
              <th><a class="btn">補足</a></th>
              <th class="last" />
            </tr>
          </tfoot>
          <tbody class="potofs fine tlist">
            <tr>
              <td class="c mdi" />
              <th class="r leave">肉屋</th>
              <th class="l leave">ニール</th>
              <td class="r leave" />
              <td class="c leave">―</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r leave">食いしん坊</th>
              <th class="l leave">マリアンヌ</th>
              <td class="r leave" />
              <td class="c leave">―</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r victim">厭世家</th>
              <th class="l victim">サイモン</th>
              <td class="r victim"> 2日</td>
              <td class="c victim">襲撃</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r executed">聖歌隊員</th>
              <th class="l executed">レティーシャ</th>
              <td class="r executed"> 3日</td>
              <td class="c executed">処刑</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r victim">靴磨き</th>
              <th class="l victim">トニー</th>
              <td class="r victim"> 3日</td>
              <td class="c victim">襲撃</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r victim">奏者</th>
              <th class="l victim">ビリー</th>
              <td class="r victim"> 4日</td>
              <td class="c victim">襲撃</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r executed">店番</th>
              <th class="l executed">ソフィア</th>
              <td class="r executed"> 4日</td>
              <td class="c executed">処刑</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r executed">漂白工</th>
              <th class="l executed">ピッパ</th>
              <td class="r executed"> 5日</td>
              <td class="c executed">処刑</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r victim">牧人</th>
              <th class="l victim">リンダ</th>
              <td class="r victim"> 5日</td>
              <td class="c victim">襲撃</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r victim">流浪者</th>
              <th class="l victim">ペラジー</th>
              <td class="r victim"> 6日</td>
              <td class="c victim">襲撃</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r executed">若者</th>
              <th class="l executed">テッド</th>
              <td class="r executed"> 6日</td>
              <td class="c executed">処刑</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r live">子守り</th>
              <th class="l live">パティ</th>
              <td class="r live" />
              <td class="c live">生存者</td>
              <td class="l"><del>...</del></td>
            </tr>
            <tr>
              <td class="c mdi" />
              <th class="r live">小娘</th>
              <th class="l live">ゾーイ</th>
              <td class="r live" />
              <td class="c live">生存者</td>
              <td class="l"><del>...</del></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
</style>
