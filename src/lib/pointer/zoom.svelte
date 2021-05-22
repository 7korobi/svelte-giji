<script lang="ts">
import type { POINT, SIZE_WITH_SCALE } from '$lib/common/config'
import type { MoveTracker, StartTracker, InputEvent, Pointer } from './tracker'
import { tracker } from './tracker'

type Apply = [number, POINT, POINT]
type Point = {
  clientX: number
  clientY: number
}

const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
const matrix = createMatrix()
export let min = 0.2
export let max = 5.0
export let scale = 1
export let x = 0
export let y = 0

let boxEl: HTMLDivElement
let zoomEl: HTMLDivElement
let apply: Apply

// subscribe initial event.
$: apply && onCalc()
$: setTransform([x, y, scale])

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const currentRect = zoomEl.getBoundingClientRect()
  apply = applyByWheel(currentRect, e)
}

function start(tracker: StartTracker, e: InputEvent) {
  if (1 < tracker.current.length) return false
  e.preventDefault()
  return true
}

function move(tracker: MoveTracker, e: InputEvent) {
  const currentRect = zoomEl.getBoundingClientRect()
  apply = applyByPointer(currentRect, tracker.previous, tracker.current)
}

function applyByWheel(
  currentRect: DOMRect,
  { clientX, clientY, deltaY, deltaMode, ctrlKey }: WheelEvent
): Apply {
  // 1 is "lines", 0 is "pixels"
  // Firefox uses "lines" for some types of mouse
  if (deltaMode === 1) deltaY *= 15

  // ctrlKey is true when pinch-zooming on a trackpad.
  const divisor = ctrlKey ? 100 : 300
  const scaleDiff = 1 - deltaY / divisor

  const origin: POINT = [clientX - currentRect.left, clientY - currentRect.top]

  return [scaleDiff, origin, [0, 0]]
}

function applyByPointer(currentRect: DOMRect, oldP: Pointer[], nowP: Pointer[]): Apply {
  console.log(oldP[0], nowP[0])

  // For calculating panning movement
  const oldMidpoint = getMidpoint(oldP[0], oldP[1])
  const nowMidpoint = getMidpoint(nowP[0], nowP[1])

  // Calculate the desired change in scale
  const oldDistance = getDistance(oldP[0], oldP[1])
  const nowDistance = getDistance(nowP[0], nowP[1])

  // Midpoint within the element
  const pan: POINT = [nowMidpoint[0] - oldMidpoint[0], nowMidpoint[1] - oldMidpoint[1]]
  const origin: POINT = [oldMidpoint[0] - currentRect.left, oldMidpoint[1] - currentRect.top]
  const scaleDiff = oldDistance ? nowDistance / oldDistance : 1

  return [scaleDiff, origin, pan]
}

function onCalc() {
  const [scaleDiff, origin, pan] = apply
  const newMatrix = createMatrix()
    .translate(pan[0], pan[1]) // Translate according to panning.
    .translate(origin[0], origin[1]) // Scale about the origin.
    .translate(x, y) // Apply current translate
    .scale(scaleDiff)
    .translate(-origin[0], -origin[1])
    .scale(scale) // Apply current scale.

  // Convert the transform into basic translate & scale.
  setTransform(toPinch(newMatrix))
}

function setTransform(upd: SIZE_WITH_SCALE) {
  let [x, y, scale] = upd
  // Get current layout
  // Not displayed. May be disconnected or display:none.
  // Just take the values, and we'll check bounds later.
  if (!zoomEl) return updateTransform(upd)

  const thisBounds = boxEl.getBoundingClientRect()
  if (!thisBounds.width || !thisBounds.height) return updateTransform(upd)
  const positioningElBounds = zoomEl.getBoundingClientRect()

  // Create points for refZoom.
  let topLeft = createPoint()
  topLeft.x = positioningElBounds.left - thisBounds.left
  topLeft.y = positioningElBounds.top - thisBounds.top
  let bottomRight = createPoint()
  bottomRight.x = positioningElBounds.width + topLeft.x
  bottomRight.y = positioningElBounds.height + topLeft.y

  // Calculate the intended position of refZoom.
  const newMatrix = createMatrix().translate(x, y).scale(scale).multiply(matrix.inverse()) // Undo current transform

  topLeft = topLeft.matrixTransform(newMatrix)
  bottomRight = bottomRight.matrixTransform(newMatrix)

  // Ensure refZoom can't move beyond out-of-bounds.
  // Correct for x
  if (topLeft.x > thisBounds.width) {
    x += thisBounds.width - topLeft.x
  } else if (bottomRight.x < 0) {
    x += -bottomRight.x
  }

  // Correct for y
  if (topLeft.y > thisBounds.height) {
    y += thisBounds.height - topLeft.y
  } else if (bottomRight.y < 0) {
    y += -bottomRight.y
  }

  updateTransform([x, y, scale])
}

/**
 * Update transform values without checking bounds. This is only called in setTransform.
 */
function updateTransform(upd: SIZE_WITH_SCALE) {
  if (upd[2] < min) return
  if (max < upd[2]) return

  x = matrix.e = upd[0]
  y = matrix.f = upd[1]
  scale = matrix.d = matrix.a = upd[2]
}

function toPinch(matrix: SVGMatrix): SIZE_WITH_SCALE {
  return [matrix.e, matrix.f, matrix.a]
}

function getDistance(a: Pointer, b?: Pointer): number {
  if (!b) return 0
  return Math.sqrt((b.point[0] - a.point[0]) ** 2 + (b.point[1] - a.point[1]) ** 2)
}

function getMidpoint(a: Pointer, b?: Pointer): POINT {
  if (!b) return a.point

  return [(a.point[0] + b.point[0]) / 2, (a.point[1] + b.point[1]) / 2]
}

function getAbsoluteValue(value: string | number, max: number): number {
  if (typeof value === 'number') return value

  if (value.trimRight().endsWith('%')) {
    return (max * parseFloat(value)) / 100
  }
  return parseFloat(value)
}

function createMatrix(): SVGMatrix {
  return SVG.createSVGMatrix()
}

function createPoint(): SVGPoint {
  return SVG.createSVGPoint()
}
</script>

<div
  use:tracker={{ start, move }}
  bind:this={boxEl}
  class="zoomBox"
  style="--x: {x}px; --y: {y}px; --scale: {scale};"
  on:wheel={onWheel}>
  <div bind:this={zoomEl} class="zoom">
    <slot />
  </div>
</div>

<style lang="scss">
.zoomBox {
  display: block;
  overflow: hidden;
  touch-action: none;
}

.zoom {
  transform: translate(var(--x), var(--y)) scale(var(--scale));
  transform-origin: 0 0;
  will-change: transform;
}
</style>
