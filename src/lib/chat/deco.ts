import { __BROWSER__ } from '$lib/browser-device'
import { regSites } from './store'

export function deco(DIV: HTMLElement) {
  DIV.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((A) => {
    if (!__BROWSER__) return
    regSites.subscribe(($regSites) => {
      if ($regSites.test(A.href)) return
      A.target = '_blank'
      A.addEventListener('click', (e) => {
        if (!window.confirm(`外部サイトです。開きますか？\n${A.href}`)) {
          e.preventDefault()
        }
      })
    })()
  })
}
