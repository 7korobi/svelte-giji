import type { POINT } from '$lib/common/config'
import PointerTracker, { Pointer } from 'pointer-tracker'

export default function trackerInit(boxEl: HTMLDivElement, zoomEl: HTMLDivElement) {
  const tracker = new PointerTracker(boxEl, {
    start(pointer, event) {
      // We only want to track 2 pointers at most
      if (tracker.currentPointers.length === 2 || !zoomEl) return false
      event.preventDefault()
      return true
    },
    move(oldP) {
      onPointerMove(oldP, tracker.currentPointers)
    }
  })
  return () => {
    window.addEventListener('wheel', onWheel)
    return () => {
      window.removeEventListener('wheel', onWheel)
    }
  }

  function onPointerMove(oldP: Pointer[], nowP: Pointer[]) {
    if (!zoomEl) return

    // Combine next points with previous points
    const currentRect = zoomEl.getBoundingClientRect()

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

    apply(scaleDiff, origin, pan)
  }

  function onWheel(event: WheelEvent) {
    if (!zoomEl) return

    event.preventDefault()
    let { deltaY } = event
    const { ctrlKey, deltaMode } = event
    // 1 is "lines", 0 is "pixels"
    // Firefox uses "lines" for some types of mouse
    if (deltaMode === 1) deltaY *= 15

    // ctrlKey is true when pinch-zooming on a trackpad.
    const divisor = ctrlKey ? 100 : 300
    const scaleDiff = 1 - deltaY / divisor

    const currentRect = zoomEl.getBoundingClientRect()
    const origin: POINT = [event.clientX - currentRect.left, event.clientY - currentRect.top]

    apply(scaleDiff, origin)
  }
}

function getMidpoint(a: Pointer, b?: Pointer): POINT {
  if (!b) return [a.clientX, a.clientY]

  return [(a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2]
}

function getDistance(a: Pointer, b?: Pointer): number {
  if (!b) return 0
  return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2)
}
