<script >
export let min;
export let max;
$: content = [
    'viewport-fit=cover',
    'width=device-width',
    'initial-scale=1.0',
    `minimum-scale=${min}`,
    ...(min < max
        ? [`maximum-scale=${max}`, 'user-scalable=yes']
        : [`maximum-scale=${max}`, 'user-scalable=no'])
].join(',');
</script>

<svelte:head>
  <meta name="viewport" {content} />
</svelte:head>
