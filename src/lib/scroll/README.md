```html
<script lang="ts">
  import { Focus } from 'svelte-scroll-observe'

  let focus = ''
</script>
<Focus id="info" bind:value="{focus}">
  <p>Hello Information</p>
</Focus>
<Focus id="info" bind:value="{focus}">
  <p>Hello Information</p>
</Focus>
```
