<script lang="ts">
import * as site from '../store'

const { topics } = site
</script>

<p>
  {#each $topics as { page, label }}
    <a sveltekit:prefetch href={page.path}>
      {label}
    </a>
  {/each}
</p>
