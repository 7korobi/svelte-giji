<script lang="ts">
import type { RANGE } from './observer'
import { tick } from 'svelte'
import browser from '$lib/browser'
import { bit, observe } from './observer'

export let base = ''
export let id = base
export let value = base
export let range = ['horizon'] as RANGE[]

const { viewSize } = browser

const tracker = observe(range, {
  async change(ops) {
    if ((ops.focus & bit.focus) === bit.focus) {
      value = id
    } else {
      await tick()
      if (id === value) {
        console.log(`focus change ${ops.focus} ${id} === ${value}`)
        value = base
      }
    }
  }
})

function focusing(el: HTMLDivElement) {
  tick().then(() => {
    if (id !== value) return
    const inline = el.clientWidth < $viewSize[0] ? 'center' : 'nearest'
    const block = el.clientHeight < $viewSize[1] ? 'center' : 'nearest'
    el.scrollIntoView({ block, inline })
  })
}
</script>

<div {id} use:focusing use:tracker.listener>
  <slot />
</div>

<style lang="scss">
div {
  border-bottom: 0.1px solid transparent; // slot margin も含めて覆う hack.
}
</style>
