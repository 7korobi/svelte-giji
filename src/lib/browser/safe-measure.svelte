<script lang="ts">
import type { OFFSET, SIZE } from '../common/config'
import { MINIMUM_PIXEL_SIZE, SAFE_HEIGHT, SAFE_WIDTH } from '../common/config'

import { state, isPortrait, isLandscape, safePoint, safeOffset, safeSize } from './store'
import { isIOS, isRadius, __BROWSER__ } from './device'

export let ratio: number
export let isDefaultSafeArea: boolean

let el: HTMLDivElement

$: compute($isPortrait, $isLandscape)
$: setSafeOffset($safeOffset)
$: setSafeSize($safeSize)

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

function setSafeOffset([top, right, bottom, left]: OFFSET) {
  if (!__BROWSER__) return
  const { style } = document.documentElement
  style.setProperty('--safe-top', `${top}px`)
  style.setProperty('--safe-right', `${right}px`)
  style.setProperty('--safe-bottom', `${bottom}px`)
  style.setProperty('--safe-left', `${left}px`)
}

function setSafeSize([width, height]: SIZE) {
  if (!__BROWSER__) return
  const { style } = document.documentElement
  style.setProperty('--safe-width', `${width}px`)
  style.setProperty('--safe-height', `${height}px`)
}
</script>

<div bind:this={el} />

<style lang="scss">
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
