<script lang="ts">
import type { DIC } from '$lib/map-reduce'
import { Erase } from '$lib/icon'

import Sub from './sub.svelte'
import Btn from './btn.svelte'

export let value: string[] = []
export let x: { _id: string; count: number }[] = []
export let y: { _id: string; count: number }[] = []
export let data: DIC<{ count: number }> = {}
export let find = (xid: string, yid: string) => `${yid}${xid}`
let focus_at = { x: '', y: '' }

function focus_on(x: string, y: string) {
  focus_at = { x, y }
}

function clear() {
  value = []
}

function xall(yid: string) {
  const ids = []
  for (const xo of x) {
    const id = find(xo._id, yid)
    if (id) ids.push(id)
  }
  return ids
}

function yall(xid: string) {
  const ids = []
  for (const yo of y) {
    const id = find(xid, yo._id)
    if (id) ids.push(id)
  }
  return ids
}

function focus_class(xid: string, yid: string, { x, y }: { x: string; y: string }) {
  const css = []
  if (xid === x || yid === y) css.push('near')
  if (xid === x && yid === y) css.push('focus')
  return css.join(' ')
}
</script>

<table on:mouseleave={() => focus_on('', '')}>
  {#if x && y}
    <tbody>
      <tr>
        <td on:mouseenter={() => focus_on('', '')}>
          <button on:click={clear}>
            <Erase />
          </button>
        </td>
        {#each x as xo, xi (xo._id)}
          <td class="r" on:mouseenter={() => focus_on(xo._id, '')}>
            <Btn type="toggle" as={yall(xo._id)} bind:value class="r fine">
              <Sub value={xo.count} /><br />
              {xo._id}
            </Btn>
          </td>
        {/each}
      </tr>
      {#each y as yo, yi (yo._id)}
        <tr>
          <td class="r" on:mouseenter={() => focus_on('', yo._id)}>
            <Btn type="toggle" as={xall(yo._id)} bind:value class="r fine">
              <Sub value={yo.count} /><br />
              {yo._id}
            </Btn>
          </td>
          {#each x as xo, xi (xo._id)}
            <td
              class="r {focus_class(xo._id, yo._id, focus_at)}"
              on:mouseenter={() => focus_on(xo._id, yo._id)}
            >
              {#if data[find(xo._id, yo._id)]}
                <Btn type="toggle" as={[find(xo._id, yo._id)]} bind:value class="r">
                  {data[find(xo._id, yo._id)].count}
                </Btn>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  {/if}
</table>
