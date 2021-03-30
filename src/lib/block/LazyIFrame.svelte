<script lang="ts">
import { onDestroy, createEventDispatcher } from 'svelte'
import { Lazy } from '../lib/lazy'

export let el: HTMLIFrameElement
export const group = 'images'
export const src = ''
export const title = ''
export const width = 0
export const height = 0
export const timeout = 40000

const dispatch = createEventDispatcher()
const lazy = new Lazy(group, el, src, timeout)
lazy.onscroll = (rect) => {
  dispatch('scroll', { rect, target: el })
}

onDestroy(() => {
  lazy.bye(group)
})
</script>

<iframe {title} {width} {height} bind:this={el} />
