<script lang="ts">
import { deco } from './deco'

export let handle: string = 'VSSAY'
</script>

<div class="post">
  <div class="chat {handle}" use:deco>
    <slot />
  </div>
</div>
