<script lang="ts">
import type { RANGE } from './observer'
import { observe } from './observer'

const COMPRESS = 'compress'
const HIDDEN = 'hidden'
const PEEP = 'peep'
const SHOW = 'show'
const FOCUS = 'focus'

export let name = ''
export let range: RANGE[] = [COMPRESS, HIDDEN, PEEP, SHOW, FOCUS]
export let focus = ''
export let state = ''

$: console.log(`name ${name}, state ${state}, focus ${focus}`)

const tracker = observe(range, {
  change(ops) {
    focus = ops.focus
    state = ops.state
  }
})

$: tracker
</script>

<div {name} use:tracker.listener>
  <slot />
</div>
