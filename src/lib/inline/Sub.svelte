<script lang="ts">
export let value: number | string
</script>

{#if value}
  <sub>{value}</sub>
{/if}
