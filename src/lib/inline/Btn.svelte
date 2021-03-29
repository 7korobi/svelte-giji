<script lang="ts">
import { Bits } from '../bits'
type TYPE = 'as' | 'set' | 'off' | 'on' | 'xor' | 'toggle'

export let value: any
export let as: any

export let type: TYPE = 'as'

$: active = isActive(type, as, value)

function isActive(type: TYPE, as: number, value: number) {
  switch (type) {
    case 'as':
      return value === as
  }
  return (value & as) === as
}

function tap() {
  switch (type) {
    case 'as':
    case 'set':
      return (value = as)
    case 'off':
      return (value &= ~as)
    case 'on':
      return (value |= as)
    case 'xor':
      return (value ^= as)
    case 'toggle':
      return (value = Bits.toggle(value, as))
  }
}
</script>

<button class:active on:click={tap}>
  <slot />
</button>
