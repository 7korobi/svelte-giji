<script lang="ts">
import talk from './Talk.svelte'
import post from './Post.svelte'
import report from './Report.svelte'
const sveltes = { talk, post, report }

export let show: keyof typeof sveltes
export let handle: string = 'VSSAY'
export let face_id: string = ''

export let log: string = ''
export let deco: 'mono' | 'head' | 'mono head' | 'head mono' | '' = ''

export let to: string = ''
export let head: string = ''
export let label: string = ''
</script>

<svelte:component this={sveltes[show]} {handle} {face_id}>
  {#if head}
    {#if to}
      <p class="name c">
        <span class="pull-right">{to}</span>▷<span class="pull-left">{head}</span>
      </p>
    {:else}
      <p class="name">
        <span class="pull-right">{label}</span>{head}
      </p>
    {/if}
    <hr />
  {/if}
  <div class={`text ${deco}`}>
    {#if log}
      {@html log}
    {:else}
      <slot />
    {/if}
  </div>
  {#if log}
    <div class="date" />
  {/if}
</svelte:component>
