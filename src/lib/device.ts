import UAParser from './ua-parser-js'

export const __SPEC__ = 'undefined' === typeof window
export const __BROWSER__ = !__SPEC__

const default_vp = {
  width: 1,
  height: 1,
  scale: 1,
  addEventListener() {},
  removeEventListener() {}
} as any

const default_inner = { innerWidth: 1, innerHeight: 1 }

export function intersectionObserverFactory(cb: IntersectionObserverCallback, init: IntersectionObserverInit): IntersectionObserver {
  if (__BROWSER__) {
    return new IntersectionObserver(cb, init)
  } else {
    return {
      observe() {},
      unobserve() {},
    } as any
  }
}

export function resizeObserverFactory(cb: ResizeObserverCallback): ResizeObserver {
  if (__BROWSER__) {
    return new ResizeObserver(cb)
  } else {
    return {
      observe() {},
      unobserve() {},
    } as any
  }
}

export function addEventListener(type: string, listener: (this: Window, ev: Event) => any, options?: boolean | AddEventListenerOptions): void {
  if (__BROWSER__) {
    window.addEventListener(type, listener, options)
  }
}

export function removeEventListener(type: string, listener: (this: Window, ev: Event) => any, options?: boolean | AddEventListenerOptions): void {
  if (__BROWSER__) {
    window.removeEventListener(type, listener, options)
  }
}

export function getInner(): { innerWidth: number; innerHeight: number } {
  return __BROWSER__ ? window : default_inner
}
export function getVisualViewport(): VisualViewport {
  return __BROWSER__ && !isLegacy ? window.visualViewport || default_vp : default_vp
}
export function getDocumentElement(): HTMLElement {
  return __BROWSER__ ? document.documentElement : ({} as any)
}
export function getBodyStyle(): CSSStyleDeclaration {
  return __BROWSER__
    ? document.body.style
    : ({
        setProperty() {}
      } as any)
}

const { device, browser, engine, os } = UAParser()

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
  isLegacy =
    !window.VisualViewport || !(window as any).ResizeObserver || !window.IntersectionObserver
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
