<script lang="ts">
import { blur, scale, slide } from 'svelte/transition'

export let key = ''
</script>

{#key key}
  <div in:blur out:blur>
    <slot />
  </div>
{/key}
