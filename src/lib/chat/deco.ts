import { __BROWSER__ } from '$lib/browser'

export function deco(DIV: HTMLElement) {
  DIV.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((A) => {
    if (!__BROWSER__ || A.href.startsWith(location.origin)) return
    A.target = '_blank'
    A.addEventListener('click', (e) => {
      if (!window.confirm(`外部サイトです。開きますか？\n${A.href}`)) {
        e.preventDefault()
      }
    })
  })
}
