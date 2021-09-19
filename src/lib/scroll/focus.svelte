<script lang="ts">
import { browser } from '$lib/store'

import { tick } from 'svelte'
import { observe } from './observer'

export let name = ''
export let value = ''

const { viewSize } = browser

const tracker = observe(['horizon'], {
  async change(ops) {
    if (ops.focus === 'focus') {
      value = name
    } else {
      await tick()
      if (name === value) value = ''
    }
  }
})

function focusing(el: HTMLDivElement) {
  if (name !== value) return
  const inline = el.clientWidth > $viewSize[0] ? 'nearest' : 'center'
  const block = el.clientHeight > $viewSize[1] ? 'nearest' : 'center'
  el.scrollIntoView({ block, inline })
}
</script>

<div {name} use:focusing use:tracker.listener>
  <slot />
</div>

<style lang="scss">
div {
  border-bottom: 0.1px solid transparent; // slot margin も含めて覆う hack.
}
</style>
