import { __BROWSER__ } from '$lib/browser'

export function setHash(hash) {
  if (!__BROWSER__) return
  const url = new URL(location.href)
  url.hash = hash
  history.pushState({}, '', url)
}
