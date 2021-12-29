<script type="ts">
import { onMount, onDestroy, createEventDispatcher } from 'svelte'
import { listen } from 'svelte/internal'
const dispatch = createEventDispatcher()

onMount(() => {
  onDestroy(listen(document, 'contextmenu', deny))
})

function deny(e: { preventDefault: () => void }) {
  e.preventDefault()
  dispatch('menu', e)
}
</script>
