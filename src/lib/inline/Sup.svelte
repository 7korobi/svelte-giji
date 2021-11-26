<script lang="ts">
export let value: number
export let min = 0
</script>

{#if min < value}
  <sup>{value}</sup>
{/if}
