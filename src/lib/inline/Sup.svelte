<script lang="ts">
export let value: number | string
</script>

{#if 'number' !== typeof value || 1 < value}
  <sup>{value}</sup>
{/if}
