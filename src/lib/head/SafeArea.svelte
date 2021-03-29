<script lang="ts">
import { ViewBox, SafeAreaBox } from '../area'
import { isIOS, isRadius, getBodyStyle } from '../device'
import ViewArea from './ViewArea.svelte'

const MINIMUM_PIXEL_SIZE = 0.2
const SAFE_WIDTH = 44
const SAFE_HEIGHT = 21
const style = getBodyStyle()

export let ratio = 1.0
export let isDefaultSafeArea = true

export let resize: { (): void }
export let scroll: { (): void }

let measure: HTMLDivElement
let [st, sr, sb, sl] = SafeAreaBox.offset
let [sw, sh] = SafeAreaBox.size

$: resize && style.setProperty('--safe-area-width', `${Math.floor(sw)}px`)
$: resize && style.setProperty('--safe-area-height', `${Math.floor(sh)}px`)

$: resize && style.setProperty('--safe-area-top', `${st}px`)
$: resize && style.setProperty('--safe-area-right', `${sr}px`)
$: resize && style.setProperty('--safe-area-bottom', `${sb}px`)
$: resize && style.setProperty('--safe-area-left', `${sl}px`)

function resizeBare() {
  const css = window.getComputedStyle(measure)
  let top = parseInt(css.marginTop)
  let right = parseInt(css.marginRight)
  let bottom = parseInt(css.marginBottom)
  let left = parseInt(css.marginLeft)
  const zeroSafety = MINIMUM_PIXEL_SIZE === Math.max(MINIMUM_PIXEL_SIZE, top, right, bottom, left)

  const [vw, vh] = ViewBox.size

  if (isDefaultSafeArea) {
    if (isRadius && !isIOS) {
      if (vh < vw && zeroSafety) {
        left = right = SAFE_WIDTH
      }
      if (vw < vh && zeroSafety) {
        bottom = SAFE_HEIGHT
      }
    }
  }

  st = top * ratio
  sr = right * ratio
  sb = bottom * ratio
  sl = left * ratio

  sw = vw - left - right
  sh = vh - top - bottom

  SafeAreaBox.measureSize(sw, sh, 1)
  SafeAreaBox.measureScroll(st, sr, sb, sl)
  resize()
}
</script>

<ViewArea resize={resize && resizeBare} {scroll} />
<div bind:this={measure} />

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
