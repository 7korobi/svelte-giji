<script lang="ts">
import type {
  FOLDER_IDX,
  GAME_ID,
  MARK_ID,
  OPTION_ID,
  ROLE_ID,
  SAY_LIMIT_ID,
  TRAP_ID
} from '$lib/pubsub/map-reduce'
import { oldlogs_stories } from '$lib/pubsub/poll'
import { Erase } from '$lib/icon'
import site from '$lib/site'
import uri from '$lib/uri'
import { Post, Report } from '$lib/chat'
import Sup from '../inline/Sup.svelte'
import Btn from '../inline/Btn.svelte'
import Grid from '../inline/Grid.svelte'

const { url } = site

export let order = ''
let search = ''
let drill = false

let folder_id = [] as FOLDER_IDX[]
let monthry = [] as string[]
let upd_range = [] as string[]
let upd_at = [] as string[]
let sow_auth_id = [] as string[]
let mark = [] as MARK_ID[]
let size = [] as string[]
let say_limit = [] as SAY_LIMIT_ID[]
let game = [] as GAME_ID[]
let option = [] as OPTION_ID[]
let trap = [] as TRAP_ID[]
let discard = [] as ROLE_ID[]
let config = [] as ROLE_ID[]

$: props = {
  folder_id,
  monthry,
  upd_range,
  upd_at,
  sow_auth_id,
  mark,
  size,
  say_limit,
  game,
  option,
  trap,
  discard,
  config,
  search
}
$: oldlogs_stories.sort(order, props as any)
$: g = $oldlogs_stories.group
$: b = $oldlogs_stories.base

$: {
  console.log(order, props)
  drill = true
}

function entrySearch() {
  order = 'name'
  drill = false
}

function reset() {
  order = ''
  folder_id = []
  monthry = []
  upd_range = []
  upd_at = []
  sow_auth_id = []
  mark = []
  size = []
  say_limit = []
  game = []
  option = []
  trap = []
  discard = []
  config = []
}
</script>

<Post handle="btns">
  <span>
    <button on:click={reset}><Erase /></button>
  </span><span>
    <Btn as="vid" bind:value={order}>州<Sup value={folder_id.length} /></Btn>
    <Btn as="marks" bind:value={order}>こだわり<Sup value={mark.length} /></Btn>
  </span><span>
    <Btn as="write_at" bind:value={order}>年月日<Sup value={monthry.length} /></Btn>
    <Btn as="upd_range" bind:value={order}>更新間隔<Sup value={upd_range.length} /></Btn>
    <Btn as="upd_at" bind:value={order}>更新時刻<Sup value={upd_at.length} /></Btn>
  </span><span>
    <Btn as="size" bind:value={order}>人数<Sup value={size.length} /></Btn>
    <Btn as="say_limit.label" bind:value={order}>発言ルール<Sup value={say_limit.length} /></Btn>
    <Btn as="game.label" bind:value={order}>ゲーム<Sup value={game.length} /></Btn>
  </span><span>
    <Btn as="sow_auth_id" bind:value={order}>村建て人<Sup value={sow_auth_id.length} /></Btn>
  </span><span>
    <Btn as="options" bind:value={order}>村設定<Sup value={option.length} /></Btn>
    <Btn as="configs" bind:value={order}>参加役職<Sup value={config.length} /></Btn>
  </span><span>
    <Btn as="traps" bind:value={order}>破棄事件<Sup value={trap.length} /></Btn>
    <Btn as="discards" bind:value={order}>破棄役職<Sup value={discard.length} /></Btn>
  </span>

  <input type="text" bind:value={order} on:focus={entrySearch} />
  <p>
    <sub style="width: 100%">{$oldlogs_stories.list.length}村があてはまります。</sub>
  </p>
</Post>

<Report handle="btns">
  {#if drill}
    {#if order === 'vid'}
      <p class="c">
        {#each g.folder_id as o (o._id)}
          <Btn type="toggle" bind:value={folder_id} as={[o._id]}
            >{o._id}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'write_at'}
      <p class="swipe">
        <Grid
          x={g.in_month}
          y={g.yeary}
          data={b.monthry}
          bind:value={monthry}
          find={(xid, yid) => `${yid}${xid}`}
        />
      </p>
    {/if}

    {#if order === 'upd_range'}
      <p class="c">
        {#each g.upd_range as o (o._id)}
          <Btn type="toggle" bind:value={upd_range} as={[o._id]}
            >{o._id}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'upd_at'}
      <p class="c">
        {#each g.upd_at as o (o._id)}
          <Btn type="toggle" bind:value={upd_at} as={[o._id]}
            >{o._id}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'sow_auth_id'}
      <p class="c">
        {#each g.sow_auth_id as o (o._id)}
          <Btn type="toggle" bind:value={sow_auth_id} as={[o._id]}
            >{o._id.replace(/\&\#2e/gi, '.')}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'marks'}
      <p class="c">
        {#each g.mark as o (o._id)}
          <Btn type="toggle" bind:value={mark} as={[o._id]}
            ><img class="mark" alt="" src="{$url.icon}{o.file}" /><Sup
              min={1}
              value={o.count}
            /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'size'}
      <p class="c">
        {#each g.size as o (o._id)}
          <Btn type="toggle" bind:value={size} as={[o._id]}
            >{o._id}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'options'}
      <p class="c">
        {#each g.option as o (o._id)}
          <Btn type="toggle" bind:value={option} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'traps'}
      <p class="c">
        {#each g.trap as o (o._id)}
          <Btn type="toggle" bind:value={trap} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'configs'}
      <p class="c">
        {#each g.config as o (o._id)}
          <Btn type="toggle" bind:value={config} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'discards'}
      <p class="c">
        {#each g.discard as o (o._id)}
          <Btn type="toggle" bind:value={discard} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'say_limit.label'}
      <p class="c">
        {#each g.say_limit as o (o._id)}
          <Btn type="toggle" bind:value={say_limit} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if order === 'game.label'}
      <p class="c">
        {#each g.game as o (o._id)}
          <Btn type="toggle" bind:value={game} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}
  {/if}
</Report>

<style lang="scss">
img.mark {
  height: 2.5ex;
}
</style>
