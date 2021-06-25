<script lang="ts">
import { topics } from './store'
</script>

<p>
  {#each $topics as { page, label }}
    <a sveltekit:prefetch href={page.path}>
      {label}
    </a>
  {/each}
</p>
