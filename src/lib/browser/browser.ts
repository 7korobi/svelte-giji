import { __BROWSER__ } from './device'
import { state, isOnline, isWatching, isActive } from './store'

export default function browserInit() {
  if (!__BROWSER__) return
  window.addEventListener('offline', setOnLine)
  window.addEventListener('online', setOnLine)
  window.addEventListener('visibilitychange', setVisibilityState)
  setOnLine()
  setVisibilityState()

  return () => {
    window.removeEventListener('offline', setOnLine)
    window.removeEventListener('online', setOnLine)
    window.removeEventListener('visibilitychange', setVisibilityState)
  }
}

function setActive() {
  isActive.set(state.isOnline && state.isWatching)
}

function setOnLine() {
  state.isOnline = window.navigator.onLine
  isOnline.set(state.isOnline)
  setActive()
}

function setVisibilityState() {
  state.isWatching = 'visible' === document.visibilityState
  isWatching.set(state.isWatching)
  setActive()
}
