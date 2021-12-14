<script type="ts">
import { keys } from './store'

export let disabled = false

function keyup({ key, code, isComposing }: KeyboardEvent) {
  const idx = $keys.indexOf(key)
  if (-1 === idx) return

  $keys.splice(idx, 1)
  $keys = $keys
}

function keydown({ key, code, repeat, isComposing }: KeyboardEvent) {
  if (disabled) return
  const idx = $keys.indexOf(key)
  if (-1 !== idx) return

  $keys.splice(0, 0, key)
  $keys = $keys
}
</script>

<svelte:body on:keyup={keyup} on:keydown={keydown} />
