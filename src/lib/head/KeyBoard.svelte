<script type="ts">
/**
 * @event {string} combo
 * @event {string} key
 */
export let paused = false
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
let combo = []
$: if (combo.length > 0) dispatch('combo', combo.join('-'))

function keyup({ key, code, isComposing }: KeyboardEvent) {
  // console.log({ key, code, isComposing })
  combo = []
}

function keydown({ key, code, repeat, isComposing }: KeyboardEvent) {
  // console.log({ key, code, repeat, isComposing })
  if (!paused) {
    if (!repeat) combo = [...combo, key]
    dispatch(key)
    dispatch('key', key)
  }
}
</script>

<svelte:body on:keyup={keyup} on:keydown={keydown} />
