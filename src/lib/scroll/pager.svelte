<script lang="ts">
import Banner from '$lib/site/chat/banner.svelte'
import Focus from './focus.svelte'
import Goal from './goal.svelte'

export let chunk = 5
export let list = []

export let focus = ''
export let last_page = Infinity
export let next_page = 1

let pages = []

const min_page = 1
$: max_page = 1 + Math.floor(list.length / chunk)
$: if (list.length) {
  const focus_idx = list.findIndex((o) => o._id === focus)
  if (focus && -1 < focus_idx) {
    const now_page = 1 + Math.floor(focus_idx / chunk)
    last_page = Math.min(max_page, now_page - 1)
    next_page = Math.max(min_page, now_page + 1)
  } else {
    last_page = Math.min(max_page, last_page, next_page)
    next_page = Math.max(min_page, last_page, next_page)
  }
  const length = Math.max(1, 1 + next_page - last_page)
  pages = Array.from({ length }, (_, k) => k + last_page)
}
</script>

{#each pages as page (page)}
  <Banner>{`p${page}`}</Banner>
  {#each list.slice((page - 1) * chunk, page * chunk) as o (o?._id)}
    {#if o}
      <Focus id={o._id} base={o.event_id} bind:value={focus}>
        <slot item={o} />
      </Focus>
    {/if}
  {/each}
{/each}

<Banner><Goal onPeep={() => (next_page = Math.min(next_page + 1, max_page))}>次頁…</Goal></Banner>
