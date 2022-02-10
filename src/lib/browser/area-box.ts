import { listen } from 'svelte/internal'
import { __BROWSER__ } from 'svelte-petit-utils'
import { isAndroid, isIOS } from './device'
import {
  state,
  isZoom,
  isKeypad,
  isPortrait,
  isLandscape,
  zoomScale,
  zoomPoint,
  viewPoint,
  zoomOffset,
  viewOffset,
  keypadSize,
  zoomSize,
  viewSize,
  safeSize
} from './store'

export default function areaBoxInit() {
  if (!__BROWSER__) return () => {}

  const bodyObserve = new ResizeObserver(onScroll)
  bodyObserve.observe(document.body)

  const byes = [
    listen(window, 'scroll', onScrollNotZoom, { passive: true }),
    listen(window.visualViewport, 'scroll', onScrollInZoom),
    listen(window.visualViewport, 'resize', onResize)
  ]

  onResize()

  return () => {
    bodyObserve.unobserve(document.body)
    bodyObserve.disconnect()

    byes.forEach((fn) => fn())
  }
}

function onScrollNotZoom() {
  onScroll()
}
function onScrollInZoom() {
  onScroll()
}

function onScroll() {
  const { width, height, offsetLeft, offsetTop, pageLeft, pageTop } = window.visualViewport
  const { clientWidth, clientHeight } = document.body
  const [vw, vh] = state.view.size

  state.zoom.measureOffset(offsetTop, vw - width - offsetLeft, vh - height - offsetTop, offsetLeft)
  state.view.measureOffset(
    pageTop,
    clientWidth - width - pageLeft,
    clientHeight - height - pageTop,
    pageLeft
  )

  zoomPoint.set(state.zoom.point)
  viewPoint.set(state.view.point)
  zoomOffset.set(state.zoom.offset)
  viewOffset.set(state.view.offset)
}

function onResize() {
  const { width, height, scale } = window.visualViewport

  state.zoom.measureSize(width, height)
  state.scale = scale

  FollowZoom(width, height, scale)
  FollowOrientation(width, height)
  FollowKeypad(width, height)
  FollowSize(width, height, scale)
  onScroll()

  isZoom.set(state.isZoom)
  isKeypad.set(state.isKeypad)
  isPortrait.set(state.isPortrait)
  isLandscape.set(state.isLandscape)

  keypadSize.set(state.keypad.size)
  zoomScale.set(state.scale)
  zoomSize.set(state.zoom.size)
  viewSize.set(state.view.size)
  safeSize.set(state.safe.size)
}

function FollowZoom(width: number, height: number, scale: number) {
  if (!isIOS) {
    state.isZoom = 1 < scale
    return
  }

  // iOSのピンチは、操作中にズーム範囲を超えることがある。
  // iOSなので window.screen.availWidth はデバイスサイズ。
  // 1.0倍未満への縮小操作の検知にこの値との比較を使う。
  let { availHeight, availWidth } = window.screen
  if (
    (width < height && availWidth < availHeight) ||
    (width > height && availWidth > availHeight)
  ) {
  } else {
    availWidth = availHeight // swapped landscape.
  }
  state.isZoom = 1 < scale || availWidth < Math.floor(width)
  return
}

function FollowOrientation(width: number, height: number) {
  const { isPortrait, isLandscape } = state
  state.isPortrait = width < height
  state.isLandscape = height < width
  if (isPortrait !== state.isPortrait && isLandscape !== state.isLandscape) {
    const [height, width] = state.view.size
    state.view.size = [width, height]
  }
}

let innerWidthOld = 0
let innerHeightOld = 0
function FollowKeypad(w2: number, h2: number) {
  const { innerWidth, innerHeight } = window

  if (isIOS) {
    const kbdHeight = innerHeight - h2
    state.isKeypad = 80 < kbdHeight
    state.keypad.size = [state.zoom.size[0], kbdHeight]
  }
  if (isAndroid) {
    if (innerWidth === innerWidthOld) {
      if (innerHeightOld < innerHeight) {
        const kbdHeight = innerHeight - innerHeightOld
        if (80 < kbdHeight) {
          state.isKeypad = false
          state.keypad.size = [state.zoom.size[0], kbdHeight]
        }
      }
      if (innerHeight < innerHeightOld) {
        const kbdHeight = innerHeightOld - innerHeight
        if (80 < kbdHeight) {
          state.isKeypad = false
          state.keypad.size = [state.zoom.size[0], kbdHeight]
        }
      }
    }
  }
  innerWidthOld = innerWidth
  innerHeightOld = innerHeight
}

function FollowSize(width: number, height: number, scale: number) {
  width *= scale
  height *= scale

  if (!state.isZoom && isAndroid && state.isKeypad) {
    height += state.keypad.size[1]
  }
  state.view.measureSize(width, height)

  const [top, right, bottom, left] = state.safe.offset
  state.safe.measureSize(width - left - right, height - top - bottom)
}
