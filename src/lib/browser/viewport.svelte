<script lang="ts">
export let min: number
export let max: number

$: content = [
  'viewport-fit=cover',
  'width=device-width',
  'initial-scale=1.0',
  `minimum-scale=${min}`,
  ...(min < max
    ? [`maximum-scale=${max}`, 'user-scalable=yes']
    : [`maximum-scale=${max}`, 'user-scalable=no'])
].join(',')
</script>

<svelte:head>
  <meta name="viewport" {content} />
</svelte:head>
