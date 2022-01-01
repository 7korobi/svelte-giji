<script lang="ts">
import {
  BellDisable,
  Biohazard,
  Catwalk,
  Drug,
  Gun,
  TimelineAlert,
  TimelineText,
  Tropical
} from '$lib/icon'
import CeroAgeC from '$lib/icon/mood/CERO_age_C.svelte'

import type { MARK_ID } from '$lib/pubsub/map-reduce'
import { Marks } from '$lib/pubsub/map-reduce'

import { url } from '$lib/site/store'

export let ids = [] as MARK_ID[]
let marks = ids.map(Marks.find)
let icons = ids.map(assignIcon)

function assignIcon(id: MARK_ID) {
  switch (id) {
    case 'biohazard':
      return Biohazard
    case 'drug':
      return Drug
    case 'crime':
      return Gun
    case 'drunk':
      return Tropical
    case 'catwalk':
      return Catwalk
    case 'word':
      return TimelineText
    case 'alert':
      return TimelineAlert
  }
  return undefined
}
</script>

<span class="mark">
  {#each ids as id, idx (id)}
    {#if icons[idx]}
      <svelte:component this={icons[idx]} />
    {:else}
      <img alt="" src="{$url.icon}{marks[idx]?.file}" />
    {/if}
  {/each}
</span>

<style lang="scss">
.mark img {
  height: 2.5ex;
}
.mark :global(svg) {
  background-color: black;
  width: 2.5ex;
  height: 2.5ex;
}
</style>
