<script lang="ts">
import { __BROWSER__ } from '$lib/browser/device'
import * as IconDic from '$lib/icon'
import { Report, Post, Talk } from '$lib/chat'

import '../_app.svelte'

const ICONS = []

for (const key of Object.keys(IconDic).sort()) {
  const Icon = IconDic[key]
  ICONS.push({ key, Icon })
}
</script>

<Report handle="SSAY">
  <h1>Welcome to SvelteKit</h1>
  <p><a sveltekit:prefetch href="/">ROOT</a></p>
  <p>Visit <a sveltekit:prefetch href="/demo">DEMO</a></p>
  <p>Visit <a sveltekit:prefetch href="/demo/color">COLOR</a></p>
</Report>

<Report handle="SSAY">
  <br />
  <article class="text x3">
    {#each ICONS as { key, Icon }, idx}
      <span class="plain">
        <Icon />
      </span>
    {/each}
  </article>
  <br />
  <article class="text x3">
    {#each ICONS as { key, Icon }, idx}
      <span class="spin">
        <Icon />
      </span>
    {/each}
  </article>
</Report>

<style lang="scss">
.x3 {
  font-size: 3rem;
}

article {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-evenly;
}
.plain {
  display: inline-block;
}

.spin {
  display: inline-block;
  animation: rotate_anime 4s linear infinite forwards;
}

@keyframes rotate_anime {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
