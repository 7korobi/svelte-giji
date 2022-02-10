<script lang="ts">
import { __BROWSER__ } from 'svelte-petit-utils'
import { MINIMUM_PIXEL_SIZE, SAFE_HEIGHT, SAFE_WIDTH } from './const'
import { isIOS, isRadius } from './device'
import { state, isPortrait, isLandscape, safePoint, safeOffset } from './store'

export let ratio: number
export let isDefaultSafeArea: boolean

let el: HTMLDivElement

$: compute($isPortrait, $isLandscape)

function compute($isPortrait: boolean, $isLandscape: boolean) {
  if (!el) return
  const css = window.getComputedStyle(el)
  let top = parseInt(css.marginTop)
  let right = parseInt(css.marginRight)
  let bottom = parseInt(css.marginBottom)
  let left = parseInt(css.marginLeft)

  const zeroSafety = MINIMUM_PIXEL_SIZE === Math.max(MINIMUM_PIXEL_SIZE, top, right, bottom, left)

  if (isDefaultSafeArea) {
    if (isRadius && !isIOS) {
      if ($isLandscape && zeroSafety) {
        left = right = SAFE_WIDTH
      }
      if ($isPortrait && zeroSafety) {
        bottom = SAFE_HEIGHT
      }
    }
  }

  state.safe.measureOffset(top * ratio, right * ratio, bottom * ratio, left * ratio)
  safeOffset.set(state.safe.offset)
  safePoint.set(state.safe.point)
}
</script>

<div bind:this={el} />

<style>
div {
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
