<script lang="ts">
export let value: number
export let min = 0
</script>

{#if min < value}
  <strong class={$$props.class}>x{value}</strong>
{/if}
