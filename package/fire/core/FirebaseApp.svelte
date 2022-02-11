<script>
import '$lib/browser';
import { onMount, setContext, createEventDispatcher } from 'svelte';
export let get;
setContext('firebase', get);
// Emit firebase
const dispatch = createEventDispatcher();
// Must be a function to ensure changes after initialization are caught
onMount(() => {
  // Set firebase context from window if needed
  const firebase = get.getApp();
  if (!firebase) {
    throw Error('No firebase app was provided. You must provide an initialized Firebase app or make it available globally.');
  }
  // Optional event to set additional config
  dispatch('initializeApp', { firebase });
  get.ready = true;
});
</script>

<slot />
