<script lang="ts">
import { onDestroy } from 'svelte'

import { createMatrix, toPinch } from './svg'
import trackerInit from './tracker'

export let boxEl: HTMLDivElement
export let zoomEl: HTMLDivElement

const state = {
  boxEl: null as HTMLDivElement,
  zoomEl: null as HTMLDivElement
}
const matrix = createMatrix()

let pinch = toPinch(matrix)

// subscribe initial event.
$: onInit = boxEl && zoomEl && trackerInit(boxEl, zoomEl)
$: if (onInit) onDestroy(onInit())
</script>

<div
  bind:this={boxEl}
  class="zoomBox"
  style="--x: {pinch[0]}px; --y: {pinch[1]}px; --scale: {pinch[2]};">
  <div bind:this={zoomEl} class="zoom">
    <slot />
  </div>
</div>

<style lang="scss">
.zoomBox {
  display: block;
  overflow: hidden;
  touch-action: none;
  --scale: 1;
  --x: 0;
  --y: 0;
}

.zoom {
  transform: translate(var(--x), var(--y)) scale(var(--scale));
  transform-origin: 0 0;
  will-change: transform;
}
</style>
