<script lang="ts">
import type { TYPE } from './button'
import { className, tap } from './button'

export let value: any
export let as: any
export let type: TYPE = 'as'
export let disabled = false
</script>

<button
  class:disabled
  class={['btn', className(type, as, value), $$props.class].join(' ')}
  data-tooltip={$$props['data-tooltip']}
  on:click={() => !disabled && (value = tap(type, as, value))}
>
  <slot />
</button>
