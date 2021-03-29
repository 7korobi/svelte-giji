import type { SIZE, POINT, OFFSET } from './util'
import { isAndroid, isIOS, isLegacy, __BROWSER__, getVisualViewport, getInner } from './device'

type SIZE_WITH_SCALE = [number, number, number]

const vp = getVisualViewport()

class AreaBox {
  scale: number

  size: SIZE
  point!: POINT
  offset!: OFFSET

  keyboardHeight: number

  isZoom: boolean
  isKeyboard: boolean
  isPortrait!: boolean
  isLandscape!: boolean

  constructor([width, height, scale]: SIZE_WITH_SCALE, offset: OFFSET) {
    this.size = [width * scale, height * scale]

    this.scale = 1
    this.isZoom = false
    this.isKeyboard = false
    this.keyboardHeight = 0
    this.measureSize(width, height, 1)
    this.measureScroll(...offset)
  }

  measureSize(width: number, height: number, scale: number) {
    this.size = [width, height]
    this.scale = scale

    const isPortrait = width < height
    const isLandscape = height < width
    this.isPortrait = isPortrait
    this.isLandscape = isLandscape
  }
  measureScroll(top: number, right: number, bottom: number, left: number) {
    this.offset = [top, right, bottom, left]
    this.point = [left, top]
  }
}

const bootSize: SIZE_WITH_SCALE = [vp.width, vp.height, vp.scale]
const bootOffset: OFFSET = [0, 0, 0, 0]

let innerWidthOld = 0
let innerHeightOld = 0

export const ViewBox = new AreaBox(bootSize, bootOffset)
export const ZoomBox = new AreaBox(bootSize, bootOffset)
export const SafeAreaBox = new AreaBox(bootSize, bootOffset)

if (!isLegacy) {
  setResize()
  setScroll()
}

export function setScroll() {
  const { width, height, offsetLeft, offsetTop, pageLeft, pageTop } = getVisualViewport()
  const [vw, vh] = ViewBox.size

  const top = Math.ceil(offsetTop)
  const right = Math.floor(vw - width - offsetLeft)
  const bottom = Math.floor(vh - height - offsetTop)
  const left = Math.ceil(offsetLeft)

  ZoomBox.measureScroll(top, right, bottom, left)
  if (!ZoomBox.isZoom) {
    const pageRight = -pageLeft
    const pageBottom = -pageTop
    ViewBox.measureScroll(pageTop, pageRight, pageBottom, pageLeft)
  }
}

export function setResize() {
  const { width, height, scale } = getVisualViewport()
  ZoomBox.measureSize(width, height, scale)
  ViewFollowZoom()
  ViewFollowKbd(width, height)
  ViewFollowSize(width, height)
}

function ViewFollowZoom() {
  ViewBox.isZoom = ZoomBox.isZoom = chkZoom()
  // ズーム中であってもなくても、orientation change に追いつく処理だけはする。
  if (ViewBox.isPortrait !== ZoomBox.isPortrait && ViewBox.isLandscape !== ZoomBox.isLandscape) {
    const [height, width] = ViewBox.size
    ViewBox.size = [width, height]
    ViewBox.isPortrait = ZoomBox.isPortrait
    ViewBox.isLandscape = ZoomBox.isPortrait
  }
}

function chkZoom() {
  const { height, width, scale } = getVisualViewport()

  if (!isIOS) {
    return 1 < scale
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
    availWidth = availHeight // swaped landscape.
  }
  return 1 < scale || availWidth < Math.floor(width)
}

function ViewFollowKbd(w2: number, h2: number) {
  const { innerWidth, innerHeight } = getInner()

  if (isIOS) {
    const kbdHeight = innerHeight - h2
    const isKbd = 80 < kbdHeight
    ViewBox.isKeyboard = ZoomBox.isKeyboard = isKbd
    ViewBox.keyboardHeight = ZoomBox.keyboardHeight = kbdHeight
  }
  if (isAndroid) {
    if (innerWidth === innerWidthOld) {
      if (innerHeightOld < innerHeight) {
        const kbdHeight = innerHeight - innerHeightOld
        if (80 < kbdHeight) {
          ViewBox.isKeyboard = ZoomBox.isKeyboard = false
          ViewBox.keyboardHeight = ZoomBox.keyboardHeight = kbdHeight
        }
      }
      if (innerHeight < innerHeightOld) {
        const kbdHeight = innerHeightOld - innerHeight
        if (80 < kbdHeight) {
          ViewBox.isKeyboard = ZoomBox.isKeyboard = true
          ViewBox.keyboardHeight = ZoomBox.keyboardHeight = kbdHeight
        }
      }
    }
  }
  innerWidthOld = innerWidth
  innerHeightOld = innerHeight
}

function ViewFollowSize(w2: number, h2: number) {
  const { isKeyboard, keyboardHeight } = ViewBox
  let [w1, h1] = ViewBox.size

  if (ZoomBox.isZoom) {
    h1 = (h2 * w1) / w2
  } else {
    w1 = w2
    h1 = h2
    if (isAndroid && isKeyboard) {
      h1 += keyboardHeight
    }
  }
  ViewBox.measureSize(w1, h1, 1)
}
