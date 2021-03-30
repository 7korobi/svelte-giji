<script type="ts">
import { onMount, onDestroy, createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

onMount(() => {
  document.addEventListener('contextmenu', deny)
})
onDestroy(() => {
  document.removeEventListener('contextmenu', deny)
})

function deny(e: { preventDefault: () => void }) {
  e.preventDefault()
  dispatch('menu', e)
}
</script>
