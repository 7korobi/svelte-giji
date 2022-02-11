<script>
export let persist = null;
import { createEventDispatcher } from 'svelte';
import { userStore } from './auth';
let store = userStore({ persist });
const dispatch = createEventDispatcher();
$: dispatch('user', { user: $store });
</script>

<slot name="before" />
{#if $store}
  <slot user={$store} auth={store.auth} />
{:else}
  <slot name="signed-out" />
{/if}
<slot name="after" />
