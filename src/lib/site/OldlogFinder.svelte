<script lang="ts">
import { oldlogs, oldlogs_stories } from '$lib/pubsub/poll'
import { Erase } from '$lib/icon'
import site from '$lib/site'
import { Post, Report } from '$lib/chat'
import Poll from '$lib/storage/Poll.svelte'
import Sup from '../inline/Sup.svelte'
import Btn from '../inline/Btn.svelte'
import Grid from '../inline/Grid.svelte'
import { Location } from '$lib/uri'
import { default_stories_query } from '$lib/pubsub/model-client'

const { url } = site

export let { list, base, group } = $oldlogs_stories
export let refresh: any = undefined
export let hash = ''
export let params = default_stories_query()
let drill = false

$: drill = params.order !== 'name'
$: ({ list, base, group } = $oldlogs_stories)

function entrySearch() {
  params.order = 'name'
}

function reset() {
  params = default_stories_query()
}

function changedStep<T extends { _id: string; at?: number }>(o: T, idx: number, list: T[]) {
  const last = list[idx - 1]
  if (last && last.at < o.at) {
    return true
  }
  return false
}
</script>

<Location {refresh} bind:hash bind:searchParams={params} />
<Poll {...oldlogs()} />

<Post handle="btns form">
  <span>
    <button on:click={reset}><Erase /></button>
  </span><span>
    <Btn as="vid" bind:value={params.order}>州<Sup value={params.folder_id.length} /></Btn>
    <Btn as="marks" bind:value={params.order}>こだわり<Sup value={params.mark.length} /></Btn>
  </span><span>
    <Btn as="write_at" bind:value={params.order}>年月日<Sup value={params.monthry.length} /></Btn>
    <Btn as="upd_range" bind:value={params.order}
      >更新間隔<Sup value={params.upd_range.length} /></Btn
    >
    <Btn as="upd_at" bind:value={params.order}>更新時刻<Sup value={params.upd_at.length} /></Btn>
  </span><span>
    <Btn as="size" bind:value={params.order}>人数<Sup value={params.size.length} /></Btn>
    <Btn as="say_limit.label" bind:value={params.order}
      >発言ルール<Sup value={params.say_limit.length} /></Btn
    >
    <Btn as="game.label" bind:value={params.order}>ゲーム<Sup value={params.game.length} /></Btn>
  </span><span>
    <Btn as="sow_auth_id" bind:value={params.order}
      >村建て人<Sup value={params.sow_auth_id.length} /></Btn
    >
  </span><span>
    <Btn as="options" bind:value={params.order}>村設定<Sup value={params.option.length} /></Btn>
    <Btn as="configs" bind:value={params.order}>参加役職<Sup value={params.config.length} /></Btn>
  </span><span>
    <Btn as="traps" bind:value={params.order}>破棄事件<Sup value={params.trap.length} /></Btn>
    <Btn as="discards" bind:value={params.order}>破棄役職<Sup value={params.discard.length} /></Btn>
  </span>

  <input type="text" bind:value={params.search} on:focus={entrySearch} />
  <p>
    <sub style="width: 100%">{$oldlogs_stories.list.length}村があてはまります。</sub>
  </p>
</Post>

<Report handle="btns form">
  {#if drill}
    {#if params.order === 'vid'}
      <p class="c">
        {#each group.folder_id as o (o._id)}
          <Btn type="toggle" bind:value={params.folder_id} as={[o._id]}
            >{o._id}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'write_at'}
      <p class="swipe">
        <Grid
          x={group.in_month}
          y={group.yeary}
          data={base.monthry}
          bind:value={params.monthry}
          find={(xid, yid) => `${yid}${xid}`}
        />
      </p>
    {/if}

    {#if params.order === 'upd_range'}
      <p class="c">
        {#each group.upd_range as o (o._id)}
          <Btn type="toggle" bind:value={params.upd_range} as={[o._id]}
            >{o._id}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'upd_at'}
      <p class="c">
        {#each group.upd_at as o, idx (o._id)}
          {#if changedStep(o, idx, group.upd_at)}<br />{/if}
          <Btn type="toggle" bind:value={params.upd_at} as={[o._id]}>
            <p class="c">{o._id}</p>
            <p class="c fine"><strong>x{o.count}</strong></p>
          </Btn>
        {/each}
      </p>
    {/if}

    {#if params.order === 'sow_auth_id'}
      <p class="c">
        {#each group.sow_auth_id as o (o._id)}
          <Btn type="toggle" bind:value={params.sow_auth_id} as={[o._id]}
            >{o._id.replace(/\&\#2e/gi, '.')}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'marks'}
      <p class="c">
        {#each group.mark as o (o._id)}
          <Btn type="toggle" bind:value={params.mark} as={[o._id]}
            ><img class="mark" alt="" src="{$url.icon}{o.file}" /><Sup
              min={1}
              value={o.count}
            /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'size'}
      <p class="c">
        {#each group.size as o (o._id)}
          <Btn type="toggle" bind:value={params.size} as={[o._id]}
            >{o._id}<Sup min={0} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'options'}
      <p class="c">
        {#each group.option as o (o._id)}
          <Btn type="toggle" bind:value={params.option} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'traps'}
      <p class="c">
        {#each group.trap as o (o._id)}
          <Btn type="toggle" bind:value={params.trap} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'configs'}
      <p class="c">
        {#each group.config as o (o._id)}
          <Btn type="toggle" bind:value={params.config} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'discards'}
      <p class="c">
        {#each group.discard as o (o._id)}
          <Btn type="toggle" bind:value={params.discard} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'say_limit.label'}
      <p class="c">
        {#each group.say_limit as o (o._id)}
          <Btn type="toggle" bind:value={params.say_limit} as={[o._id]}
            >{o.label}<Sup min={1} value={o.count} /></Btn
          >
        {/each}
      </p>
    {/if}

    {#if params.order === 'game.label'}
      <p class="c">
        {#each group.game as o (o._id)}
          <Btn type="toggle" bind:value={params.game} as={[o._id]}
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
