<script lang="ts">
import store from 'svelte-browser'
const { viewOffset } = store

$: offsetFilm = Math.floor(-0.5 * $viewOffset[0])
</script>

<div class="fullframe">
  <div class="outframe filmline" style={`background-position: ${-offsetFilm}px 0;`} />
  <div class="portrates">
    <slot />
  </div>
  <div class="outframe filmline" style={`background-position: ${offsetFilm}px 0;`} />
</div>

<style lang="sass">
.portrates
  background-color: black
  box-sizing: border-box
  padding: 4px 5vw
</style>
