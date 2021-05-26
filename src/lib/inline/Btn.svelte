<script lang="ts">
import type { TYPE } from './button'
import { className, tap } from './button'

export let value: any
export let as: any

export let type: TYPE = 'as'
</script>

<button class={className(type, as, value)} on:click={() => (value = tap(type, value, as))}>
  <slot />
</button>
