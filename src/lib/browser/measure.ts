import * as store from './store'
import { __BROWSER__ } from '$lib/common'

export function KeypadSize({ style }: HTMLElement) {
  if (!__BROWSER__) return
  const bye = store.keypadSize.subscribe(([width, height]) => {
    style.setProperty('--keypad-width', `${width}px`)
    style.setProperty('--keypad-height', `${height}px`)
  })
  return {
    destroy() {
      bye()
    }
  }
}

export function ViewOffset({ style }: HTMLElement) {
  if (!__BROWSER__) return
  const bye = store.viewOffset.subscribe(([top, right, bottom, left]) => {
    style.setProperty('--view-top', `${top}px`)
    style.setProperty('--view-right', `${right}px`)
    style.setProperty('--view-bottom', `${bottom}px`)
    style.setProperty('--view-left', `${left}px`)
  })
  return {
    destroy() {
      bye()
    }
  }
}

export function ViewSize({ style }: HTMLElement) {
  if (!__BROWSER__) return
  const bye = store.viewSize.subscribe(([width, height]) => {
    style.setProperty('--view-width', `${width}px`)
    style.setProperty('--view-height', `${height}px`)
  })
  return {
    destroy() {
      bye()
    }
  }
}

export function SafeOffset({ style }: HTMLElement) {
  if (!__BROWSER__) return
  const bye = store.safeOffset.subscribe(([top, right, bottom, left]) => {
    style.setProperty('--safe-top', `${top}px`)
    style.setProperty('--safe-right', `${right}px`)
    style.setProperty('--safe-bottom', `${bottom}px`)
    style.setProperty('--safe-left', `${left}px`)
  })
  return {
    destroy() {
      bye()
    }
  }
}

export function SafeSize({ style }: HTMLElement) {
  if (!__BROWSER__) return
  const bye = store.safeSize.subscribe(([width, height]) => {
    style.setProperty('--safe-width', `${width}px`)
    style.setProperty('--safe-height', `${height}px`)
  })
  return {
    destroy() {
      bye()
    }
  }
}

export function ZoomOffset({ style }: HTMLElement) {
  if (!__BROWSER__) return
  const bye = store.zoomOffset.subscribe(([top, right, bottom, left]) => {
    style.setProperty('--zoom-top', `${top}px`)
    style.setProperty('--zoom-right', `${right}px`)
    style.setProperty('--zoom-bottom', `${bottom}px`)
    style.setProperty('--zoom-left', `${left}px`)
  })
  return {
    destroy() {
      bye()
    }
  }
}

export function ZoomSize({ style }: HTMLElement) {
  if (!__BROWSER__) return
  const bye = store.zoomSize.subscribe(([width, height]) => {
    const zoomScale = store.state.scale
    style.setProperty('--zoom-width', `${width}px`)
    style.setProperty('--zoom-height', `${height}px`)
    style.setProperty('--zoom-in', `${zoomScale}`)
    style.setProperty('--zoom-out', `${1 / zoomScale}`)
  })
  return {
    destroy() {
      bye()
    }
  }
}
