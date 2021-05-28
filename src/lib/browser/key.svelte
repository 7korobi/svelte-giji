<script type="ts">
/**
 * @event {string} combo
 * @event {string} key
 */
export let disabled = false
import { keys } from './store'

function keyup({ key, code, isComposing }: KeyboardEvent) {
  const idx = $keys.indexOf(key)
  if (-1 === idx) return
  $keys.splice(idx, 1)
  $keys = $keys
}

function keydown({ key, code, repeat, isComposing }: KeyboardEvent) {
  if (!disabled) {
    const idx = $keys.indexOf(key)
    if (-1 !== idx) return
    $keys.splice(0, 0, key)
    $keys = $keys
  }
}
</script>

<svelte:body on:keyup={keyup} on:keydown={keydown} />
