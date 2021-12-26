<script type="ts">
import { deco } from './deco'
</script>

<div class="banner">
  <div class="public">
    <article class="text" use:deco>
      <slot />
    </article>
  </div>
</div>
