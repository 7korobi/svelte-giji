<script lang="ts">
import talk from './talk.svelte'
import post from './post.svelte'
import report from './report.svelte'
import logo from './logo.svelte'

import Mention from '../inline/mention.svelte'
import type { BookStory } from '$lib/pubsub/map-reduce'
const sveltes = { talk, post, report, logo }

export let show: keyof typeof sveltes
export let handle: string = 'VSSAY'
export let face_id: string = ''

export let log: string = ''
export let deco: 'mono' | 'head' | 'mono head' | 'head mono' | '' = ''

export let to: string = ''
export let name: string = ''
export let label: string = ''

export let _id: string
export let story: BookStory
</script>

<svelte:component this={sveltes[show]} {handle} {face_id} {story}>
  {#if name}
    {#if to}
      <p class="name c">
        <span class="pull-right">{to}</span>▷<span class="pull-left">{name}</span>
      </p>
    {:else}
      <p class="name">
        {#if label}<span class="pull-right">{label}</span>{/if}
        {name}
      </p>
    {/if}
    <hr />
  {/if}
  <p class={`text ${deco}`}>
    {#if log}
      {@html log}
    {:else}
      <slot />
    {/if}
  </p>
  {#if _id}
    <p class="date">
      <Mention id={_id} let:mention>{mention}</Mention>
    </p>
  {/if}
</svelte:component>
