<script lang="ts">
export async function toggle() {
  if (document.fullscreenElement === el) {
    await document.exitFullscreen()
  } else {
    await el.requestFullscreen()
  }
}

let el: HTMLDivElement
</script>

<div bind:this={el}>
  <slot>fullscreen empty.</slot>
</div>
