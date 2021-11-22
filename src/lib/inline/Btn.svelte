<script lang="ts">
import type { TYPE } from './button'
import { className, tap } from './button'

export let value: any
export let as: any

export let type: TYPE = 'as'
</script>

<button
  class={[className(type, as, value), $$props.class].join(' ')}
  data-tooltip={$$props['data-tooltip']}
  on:click={() => (value = tap(type, as, value))}
>
  <slot />
</button>
