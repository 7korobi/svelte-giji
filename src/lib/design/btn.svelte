<script lang="ts">
import { listen } from 'svelte/internal'
import type { TYPE } from './button'
import { className, tap } from './button'

export let value: any
export let as: any
export let type: TYPE = 'as'
export let disabled = false
export let expand = false

function doClick() {
  if (disabled) return
  value = tap(type, as, value)
}

function clicker(el: HTMLElement, isExpand: boolean) {
  let targetEl: HTMLElement
  let destroy = mount()
  return { update, destroy }

  function mount() {
    targetEl = isExpand ? el.parentElement : el
    return listen(targetEl, 'click', doClick)
  }

  function update(newExpand) {
    if (newExpand !== isExpand) {
      destroy()
      isExpand = newExpand
      destroy = mount()
    }
  }
}
</script>

<button
  use:clicker={expand}
  class:disabled
  class={['btn', className(type, as, value), $$props.class].join(' ')}
  title={$$props['title']}
  data-tooltip={$$props['data-tooltip']}
>
  <slot />
</button>
