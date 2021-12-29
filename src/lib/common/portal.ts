import type { DIC } from '$lib/map-reduce'
import { tick } from 'svelte'

export const portals: DIC<{ (el: HTMLElement): { destroy(): void } }> = {}

export function portal(selector: string = undefined) {
  let targetEl: HTMLElement

  if (selector) {
    catchSlot(3)
    return { mount }
  } else {
    return { slot, mount }
  }

  async function catchSlot(remain: number) {
    targetEl = document.querySelector(selector)
    if (remain && !targetEl) {
      await tick()
      catchSlot(remain - 1)
    }
  }

  function slot(el: HTMLElement) {
    targetEl = el
    return { destroy }
    function destroy() {}
  }

  function mount(el: HTMLElement) {
    ;(async () => {
      await tick()
      targetEl.appendChild(el)
    })()
    return { destroy }
    function destroy() {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  }
}
