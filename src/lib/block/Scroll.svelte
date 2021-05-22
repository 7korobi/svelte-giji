<script context="module" lang="ts">
import { __BROWSER__ } from '../browser/device'

const COMPRESS = 'compress'
const HIDDEN = 'hidden'
const PEEP = 'peep'
const SHOW = 'show'

const invisible = {
  compress: true,
  hidden: true
}

addEventListener('scroll', (e) => {
  scrollEls.forEach((target) => {
    const scroll = target.getBoundingClientRect()
    target.dispatchEvent(new CustomEvent('--scroll', { detail: { scroll } }))
  })
})

function cbRange(
  eventType: string,
  keyOn: string,
  keyOff: string,
  entries: IntersectionObserverEntry[]
) {
  entries.forEach(({ target, isIntersecting }) => {
    const range = isIntersecting ? keyOn : keyOff
    target.dispatchEvent(new CustomEvent(eventType, { detail: { range } }))
  })
}

function cbFocus(eventType: string, entries: IntersectionObserverEntry[]) {
  entries.forEach(({ target, isIntersecting, rootBounds, boundingClientRect }) => {
    let sides = []
    if (isIntersecting) sides.push('focus')
    if (rootBounds.top > boundingClientRect.bottom) sides.push('top')
    if (rootBounds.right < boundingClientRect.left) sides.push('right')
    if (rootBounds.bottom < boundingClientRect.top) sides.push('bottom')
    if (rootBounds.left > boundingClientRect.right) sides.push('left')
    const focus = sides.join('-')
    target.dispatchEvent(new CustomEvent(eventType, { detail: { focus } }))
  })
}

const scrollEls = new Set<Element>()
</script>

<script lang="ts">
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
const observe = observeFactory()

export let range = [COMPRESS, HIDDEN, PEEP, SHOW]
export let focus = true
export let scroll = false
export let name = ''

let e = {
  name,
  range: '',
  focus: '',
  scroll: null as DOMRect
}

let onRange
let onScroll

$: Object.assign(e, { name })

$: if (scroll) {
  onRange = fireRangeWithScroll
  onScroll = fireScroll
} else {
  onRange = fireRange
}

function onFocus({ target, detail }) {
  e = Object.assign(e, detail, { target })
  dispatch('focus', e)
  dispatch('change', e)
}

function fireScroll({ target, detail }) {
  e = Object.assign(e, detail, { target })
  dispatch('scroll', e)
  dispatch('change', e)
}

function fireRange({ target, detail }) {
  e = Object.assign(e, detail, { target })
  dispatch('range', e)
  dispatch('change', e)
}

function fireRangeWithScroll({ target, detail }) {
  if (invisible[detail.mode]) {
    scrollEls.delete(target)
  } else {
    scrollEls.add(target)
  }
  e = Object.assign(e, detail, { target })
  dispatch('range', e)
  dispatch('change', e)
}

function observeFactory() {
  if (!__BROWSER__) return () => {}
  const deployObserver = new IntersectionObserver(cbRange.bind(null, '--range', HIDDEN, COMPRESS), {
    rootMargin: '25%',
    threshold: 0
  })

  const peepObserver = new IntersectionObserver(cbRange.bind(null, '--range', PEEP, HIDDEN), {
    rootMargin: '0%',
    threshold: 0
  })

  const showObserver = new IntersectionObserver(cbRange.bind(null, '--range', SHOW, PEEP), {
    rootMargin: '0%',
    threshold: 1
  })

  const coreObserver = new IntersectionObserver(cbFocus.bind(null, '--focus'), {
    rootMargin: '-50%',
    threshold: 0
  })

  return (el: any) => {
    if (range.includes(HIDDEN) && range.includes(COMPRESS)) deployObserver.observe(el)
    if (range.includes(PEEP) && range.includes(HIDDEN)) peepObserver.observe(el)
    if (range.includes(SHOW) && range.includes(PEEP)) showObserver.observe(el)

    if (focus) coreObserver.observe(el)

    return { destroy }
    function destroy() {
      deployObserver.unobserve(el)
      peepObserver.unobserve(el)
      showObserver.unobserve(el)
      coreObserver.unobserve(el)
    }
  }
}
</script>

<div
  {name}
  class="{e.focus} {e.range}"
  use:observe
  on:--range={onRange}
  on:--focus={onFocus}
  on:--scroll={onScroll}>
  <slot />
</div>
