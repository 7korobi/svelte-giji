<script lang="ts">
export let value: number | string
</script>

{#if value}
  <sup>{value}</sup>
{/if}
