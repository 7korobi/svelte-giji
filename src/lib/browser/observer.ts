import { __BROWSER__ } from 'svelte-petit-utils'

type width = number
type height = number

type SIZE = [width, height]
type ElementResize = (rect: SIZE) => any

const resized = new Map<Element, ElementResize>()
const resizes =
  __BROWSER__ &&
  new ResizeObserver(([entry]) => {
    const { offsetWidth, offsetHeight } = entry.target as HTMLElement
    resized.get(entry.target)([offsetWidth, offsetHeight])
  })

export function onResize(el: HTMLElement, cb: ElementResize) {
  console.log('init resizer', el)
  update(cb)
  resized.set(el, cb)
  resizes.observe(el)
  return { update, destroy }

  function update(newCb: ElementResize) {
    cb = newCb
    console.log('update resizer', cb)
    resized.set(el, cb)
    const { offsetWidth, offsetHeight } = el
    cb([offsetWidth, offsetHeight])
    return
  }

  function destroy() {
    resizes.unobserve(el)
    resized.delete(el)
  }
}
