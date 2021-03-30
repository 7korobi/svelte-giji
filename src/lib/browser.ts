import { readable, derived } from 'svelte/store'
import { __BROWSER__, addEventListener, removeEventListener } from './device'

function onLine() {
  if (__BROWSER__) {
    return window.navigator.onLine
  } else {
    return false
  }
}

function visibility() {
  if (__BROWSER__) {
    return document.visibilityState
  } else {
    return true
  }
}

export const isOnline = readable(onLine(), (set) => {
  addEventListener('offline', update)
  addEventListener('online', update)

  function update() {
    set(onLine())
    requestAnimationFrame(() => {
      set(onLine())
    })
  }

  return function release() {
    removeEventListener('offline', update)
    removeEventListener('online', update)
  }
})

export const isWatching = readable('hidden' !== visibility(), (set) => {
  addEventListener('visibilitychange', update)

  function update() {
    set('hidden' !== visibility())
    requestAnimationFrame(() => {
      set('hidden' !== visibility())
    })
  }

  return function release() {
    removeEventListener('visibilitychange', update)
  }
})

export const isActive = derived([isOnline, isWatching], ([online, watching]) => online && watching)

export function readyOnline(): Promise<void> {
  return new Promise((ok) => {
    if (onLine()) {
      ok()
    } else {
      addEventListener('online', update)
    }

    function update() {
      removeEventListener('online', update)
      ok()
    }
  })
}

export function readyWatching(): Promise<void> {
  return new Promise((ok) => {
    if ('hidden' !== visibility()) {
      ok()
    } else {
      addEventListener('visibilitychange', update)
    }

    function update() {
      if ('hidden' === visibility()) return
      removeEventListener('visibilitychange', update)
      ok()
    }
  })
}

export function readyDownload(
  el: HTMLImageElement | HTMLIFrameElement,
  url: string,
  timeout = 20000
): Promise<Event> {
  return new Promise((ok, ng) => {
    const timer = setTimeout(fail, timeout)
    el.addEventListener('--abort', fail)
    el.addEventListener('error', fail)
    el.addEventListener('load', success)
    el.src = url

    function bye() {
      clearTimeout(timer)
      el.removeEventListener('--abort', fail)
      el.removeEventListener('error', fail)
      el.removeEventListener('load', success)
    }

    function fail(e: Event = new addEventListener(`timeout ${timeout / 1000}sec`)) {
      el.src = ''
      bye()
      ng(e)
    }

    function success(e: Event) {
      bye()
      ok(e)
    }
  })
}
