<script>
import Focus from './focus.svelte';
import { bit, observe } from './observer';
export let range = ['horizon'];
export let chunk = 5;
export let id = (o) => '';
export let base = (o) => '';
export let list = [];
export let focus = '';
export let page = 1;
let global_focus = 0;
let last_page = Infinity;
let next_page = 1;
let pages = [];
const tracker = observe(['box'], {
  async change(ops) {
    global_focus = ops.focus;
  }
});
const min_page = 1;
$: console.log({
  top: bit.top & global_focus,
  bottom: bit.bottom & global_focus,
  focus: bit.focus & global_focus
});
$: max_page = 1 + Math.floor(list.length / chunk);
$: if (list.length) {
  const focus_idx = list.findIndex((o) => o._id === focus);
  if (focus && -1 < focus_idx) {
    page = 1 + Math.floor(focus_idx / chunk);
    last_page = Math.min(max_page, page - 1);
    next_page = Math.max(min_page, page + 1);
  } else {
    const is_top = (global_focus & bit.top) === bit.top;
    const is_bottom = (global_focus & bit.bottom) === bit.bottom;
    if (is_top) {
      page = max_page;
      last_page = Math.max(min_page, max_page - 1);
      next_page = max_page;
    }
    if (is_bottom) {
      page = min_page;
      last_page = min_page;
      next_page = Math.min(max_page, min_page + 1);
    }
    if (!is_top && !is_bottom) {
      last_page = Math.min(max_page, last_page, next_page);
      next_page = Math.max(min_page, last_page, next_page);
    }
  }
  const length = Math.max(1, 1 + next_page - last_page);
  pages = Array.from({ length }, (_, k) => k + last_page);
}
</script>

<div use:tracker.listener>
  {#each pages as page (page)}
    <slot name="page" {page} />
    {#each list.slice((page - 1) * chunk, page * chunk) as o (id(o))}
      {#if o}
        <Focus {range} id={id(o)} base={base(o)} bind:value={focus}>
          <slot item={o} />
        </Focus>
      {/if}
    {/each}
  {/each}
</div>
