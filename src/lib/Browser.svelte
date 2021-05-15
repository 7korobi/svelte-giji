<script lang="ts">
import { onMount } from 'svelte'
import { inner, outer, active } from './browser'
import { isRadius, isIOS, __BROWSER__ } from './device'

export let ratio = 1.0

const SAFE_WIDTH = 44
const SAFE_HEIGHT = 21

let isOnline = false
let isWatching = false
let innerWidth = 1000
let innerHeight = 1000
let outerWidth = 1000
let outerHeight = 1000
let safeAreaWidth = 1000
let safeAreaHeight = 1000
let safeAreaTop = 0
let safeAreaRight = 0
let safeAreaBottom = 0
let safeAreaLeft = 0

let measure: HTMLDivElement
$: css = measure && window.getComputedStyle(measure)

$: inner.update(() => [innerWidth, innerHeight, console.log("inner")])
$: outer.update(() => [outerWidth, outerHeight, console.log("outer")])

$: {
  const isActive = isOnline && isWatching
  active.update(() => ({ isActive, isOnline, isWatching }))
}

$: {
  if (css) {
    safeAreaTop = parseInt(css.marginTop)
    safeAreaRight = parseInt(css.marginRight)
    safeAreaBottom = parseInt(css.marginBottom)
    safeAreaLeft = parseInt(css.marginLeft)
    const zeroSafety =
      0.2 === Math.max(0.2, safeAreaTop, safeAreaRight, safeAreaBottom, safeAreaLeft)

    if (zeroSafety && isRadius && !isIOS) {
      if (outerHeight < outerWidth) {
        safeAreaLeft = safeAreaRight = SAFE_WIDTH
      }
      if (outerWidth < outerHeight) {
        safeAreaBottom = SAFE_HEIGHT
      }
    }
    safeAreaTop *= ratio
    safeAreaRight *= ratio
    safeAreaBottom *= ratio
    safeAreaLeft *= ratio
    safeAreaWidth = outerWidth - safeAreaLeft - safeAreaRight
    safeAreaHeight = outerHeight - safeAreaTop - safeAreaBottom
  }
}
onMount(() => {
  document.addEventListener('visibilitychange', updateWatching)
  updateWatching()

  return () => {
    document.removeEventListener('visibilitychange', updateWatching)
  }
})

function updateWatching() {
  isWatching = 'hidden' !== document.visibilityState
}
</script>

<svelte:window
  bind:innerWidth
  bind:innerHeight
  bind:outerWidth
  bind:outerHeight
  bind:online={isOnline} />

<div class="measure" bind:this={measure} />

<style>
.measure {
  pointer-events: none;
  user-select: none;
  visibility: hidden;

  z-index: -99999;

  opacity: 0;
  width: 0;
  height: 0;

  margin-top: env(safe-area-inset-top);
  margin-right: env(safe-area-inset-right);
  margin-bottom: env(safe-area-inset-bottom);
  margin-left: env(safe-area-inset-left);
}
</style>
