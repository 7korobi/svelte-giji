import PointerTracker, { Pointer } from 'pointer-tracker'
import type { POINT, SIZE_WITH_SCALE } from '../common/config'

import Zoom from "./index.svelte"

const MIN_SCALE = 0.1

type Point = {
  clientX: number
  clientY: number
}

type ScaleToProp = {
  origin?: [number | string, number | string]
  relativeTo?: 'container' | 'content'
  isEvent?: boolean
}

export default Zoom
  function apply(scaleDiff: number, origin: POINT, pan: POINT = [0, 0], isEvent = true) {
    const matrix = createMatrix()
      .translate(pan[0], pan[1]) // Translate according to panning.
      .translate(origin[0], origin[1]) // Scale about the origin.
      .translate(pinch[0], pinch[1]) // Apply current translate
      .scale(scaleDiff)
      .translate(-origin[0], -origin[1])
      .scale(pinch[2]) // Apply current scale.

    // Convert the transform into basic translate & scale.
    setTransform(toPinch(matrix), isEvent)
  }

  function scaleTo(scale: number, opts: ScaleToProp = {}) {
    const { relativeTo = 'content', isEvent = false } = opts
    const relativeToEl = relativeTo === 'content' ? refZoom.current : refBox.current
    const rect = relativeToEl.getBoundingClientRect()

    let x = getAbsoluteValue(opts.origin[0], rect.width)
    let y = getAbsoluteValue(opts.origin[1], rect.height)

    if (relativeTo === 'content') {
      x += pinch[0]
      y += pinch[1]
    } else {
      const currentRect = refZoom.current.getBoundingClientRect()
      x -= currentRect.left
      y -= currentRect.top
    }

    const scaleDiff = scale / pinch[2]
    apply(scaleDiff, [x, y], [0, 0], isEvent)
  }

  function setTransform(upd: SIZE_WITH_SCALE, isEvent = false) {
    let [x, y, scale] = upd
    // Get current layout
    // Not displayed. May be disconnected or display:none.
    // Just take the values, and we'll check bounds later.
    if (!refZoom.current) return updateTransform(upd, isEvent)

    const thisBounds = refBox.current.getBoundingClientRect()
    if (!thisBounds.width || !thisBounds.height) return updateTransform(upd, isEvent)
    const positioningElBounds = refZoom.current.getBoundingClientRect()

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

    updateTransform([x, y, scale], isEvent)
  }

  /**
   * Update transform values without checking bounds. This is only called in setTransform.
   */
  function updateTransform(upd: SIZE_WITH_SCALE, isEvent: boolean) {
    const [x, y, scale] = upd
    // Avoid scaling to zero
    if (scale < MIN_SCALE) return

    // Return if there's no change
    if (x === pinch[0] && y === pinch[1] && scale === pinch[2]) return

    matrix.e = x
    matrix.f = y
    matrix.d = matrix.a = scale
    setPinch(upd)

    if (isEvent) refBox.current.dispatchEvent(new Event('change', { bubbles: true }))
  }
}


function getAbsoluteValue(value: string | number, max: number): number {
  if (typeof value === 'number') return value

  if (value.trimRight().endsWith('%')) {
    return (max * parseFloat(value)) / 100
  }
  return parseFloat(value)
}

