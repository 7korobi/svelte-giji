```html
<script lang="ts">
  import { Focus, Pager } from 'svelte-scroll-observe'

  let focus = ''
</script>
<Focus id="info" bind:value="{focus}">
  <p>Hello Information</p>
</Focus>
<Focus id="info" bind:value="{focus}">
  <p>Hello Information</p>
</Focus>

<Pager chunk="{10}" bind:page="{at_page}" bind:focus="{hash}" id={(item)=>item.id} bind:list let:item="{item}">
  <div id="{item.id}">{item.name}</div>
</Pager>
```
