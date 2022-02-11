<script>
import { __BROWSER__ } from 'svelte-petit-utils';
import { Operations } from './tracker';
const SVG = __BROWSER__ ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : null;
const matrix = createMatrix();
const tracker = new Operations({ start, move, wheel });
export let mode = 'image';
export let min = 0.2;
export let max = 5.0;
export let scale = 1;
export let x = 0;
export let y = 0;
// subscribe initial event.
$: setTransform([x, y, scale]);
function wheel(ops, e) {
  e.preventDefault();
  calc(ops.wheel, [0, 0]);
}
function start({ current }, e) {
  if (2 < current.length) return false;
  e.preventDefault();
  return true;
}
function move(ops, e) {
  const gap = ops.relationGap(-2);
  calc(gap.wheel[0], gap.pan[0]);
}
function calc([ox, oy, scaleDiff], [panX, panY]) {
  const newMatrix = createMatrix()
    .translate(panX, panY) // Translate according to panning.
    .translate(ox, oy) // Scale about the origin.
    .translate(x, y) // Apply current translate
    .scale(scaleDiff)
    .translate(-ox, -oy)
    .scale(scale); // Apply current scale.
  // Convert the transform into basic translate & scale.
  setTransform(toPinch(newMatrix));
}
function setTransform([x, y, scale]) {
  if (!matrix) return;
  // Get current layout
  // Not displayed. May be disconnected or display:none.
  // Just take the values, and we'll check bounds later.
  if (!(tracker && tracker.originEl && tracker.handlerEl)) return updateTransform([x, y, scale]);
  const thisBounds = tracker.handlerEl.getBoundingClientRect();
  if (!thisBounds.width || !thisBounds.height) return updateTransform([x, y, scale]);
  // Create points for refZoom.
  let topLeft = createPoint();
  topLeft.x = tracker.offset[0] - thisBounds.left;
  topLeft.y = tracker.offset[1] - thisBounds.top;
  let bottomRight = createPoint();
  bottomRight.x = tracker.size[0] + topLeft.x;
  bottomRight.y = tracker.size[1] + topLeft.y;
  // Calculate the intended position of refZoom.
  const newMatrix = createMatrix().translate(x, y).scale(scale).multiply(matrix.inverse()); // Undo current transform
  topLeft = topLeft.matrixTransform(newMatrix);
  bottomRight = bottomRight.matrixTransform(newMatrix);
  // Ensure refZoom can't move beyond out-of-bounds.
  // Correct for x
  if (topLeft.x > thisBounds.width) {
    x += thisBounds.width - topLeft.x;
  } else if (bottomRight.x < 0) {
    x += -bottomRight.x;
  }
  // Correct for y
  if (topLeft.y > thisBounds.height) {
    y += thisBounds.height - topLeft.y;
  } else if (bottomRight.y < 0) {
    y += -bottomRight.y;
  }
  updateTransform([x, y, scale]);
}
/**
 * Update transform values without checking bounds. This is only called in setTransform.
 */
function updateTransform(upd) {
  if (upd[2] < min) return;
  if (max < upd[2]) return;
  x = matrix.e = upd[0];
  y = matrix.f = upd[1];
  scale = matrix.d = matrix.a = upd[2];
}
function toPinch(matrix) {
  return [matrix.e, matrix.f, matrix.a];
}
function createMatrix() {
  return SVG?.createSVGMatrix();
}
function createPoint() {
  return SVG?.createSVGPoint();
}
</script>

<div use:tracker.listener class="zoomBox" style="--x: {x}px; --y: {y}px; --scale: {scale};">
  <div bind:this={tracker.originEl} class={mode}>
    <slot />
  </div>
</div>

<style>
.zoomBox {
  display: block;
  overflow: hidden;
  touch-action: none;
}

.image {
  transform: translate(var(--x), var(--y)) scale(var(--scale));
  transform-origin: 0 0;
  will-change: transform;
}

.text {
  font-size: calc(1rem * var(--scale));
  line-height: calc(1.5em * var(--scale));
  will-change: font-size;
}
</style>
