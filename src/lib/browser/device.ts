import UAParser from 'ua-parser-js'
import { __BROWSER__ } from '$lib/common'

const { device, browser, engine, os } = ((UAParser as unknown) as () => UAParser.IResult)()

let isLegacy = false
let isRadius = false

let isIOS = false
let isAndroid = false

let isPC = false
let isTablet = false
let isMobile = false

let isBlink = false
let isWebkit = false

let isMacSafari = false
let isIOSlegacy = false
if (__BROWSER__) {
  isLegacy = !window.VisualViewport || !window.ResizeObserver || !window.IntersectionObserver
}

switch (device.type) {
  case 'tablet':
    isTablet = true
    break
  case 'mobile':
    isMobile = true
    break
  default:
    isPC = true
}

switch (browser.name) {
  case 'Mobile Safari':
    isIOS = true
    break
  case 'Safari':
    isMacSafari = true
    break
}

switch (engine.name) {
  case 'WebKit':
  case 'Webkit':
    isWebkit = true
    break
  case 'Blink':
    isBlink = true
    break
}

switch (os.name) {
  case 'Android':
    isAndroid = true
    break
  case 'iOS':
    isIOS = true
    break
  case 'Mac OS':
    isMacSafari = isWebkit
    isPC = true
    break
}

if (isAndroid || isIOS) {
  isPC = false
}

if (isIOS && isLegacy) {
  isIOSlegacy = true
}

if (isMobile) {
  isRadius = true
}

export {
  device,
  browser,
  engine,
  os,
  isLegacy,
  isRadius,
  isIOS,
  isAndroid,
  isPC,
  isTablet,
  isMobile,
  isBlink,
  isMacSafari,
  isIOSlegacy
}
