<script>
import { blur } from 'svelte/transition';
export let key = '';
</script>

{#key key}
  <div in:blur out:blur>
    <slot />
  </div>
{/key}
