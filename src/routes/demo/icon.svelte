<script lang="ts">
import { __BROWSER__ } from '$lib/common'
import * as IconDic from '$lib/icon'
import { Report } from '$lib/site/chat'

import '../_app.svelte'

const ICONS = []

for (const key of Object.keys(IconDic).sort()) {
  const Icon = IconDic[key]
  ICONS.push({ key, Icon })
}
</script>

<Report handle="footer">
  <h1>Welcome to SvelteKit</h1>
  <p><a sveltekit:prefetch href="/">ROOT</a></p>
  <p>Visit <a sveltekit:prefetch href="/demo">DEMO</a></p>
  <p>Visit <a sveltekit:prefetch href="/demo/color">COLOR</a></p>
</Report>

<Report handle="TSAY">
  <br />
  <p class="text x3">
    {#each ICONS as { Icon }}
      <span class="plain">
        <Icon />
      </span>
    {/each}
  </p>
  <br />
</Report>

<Report handle="SSAY">
  <br />
  <p class="text x3">
    {#each ICONS as { Icon }}
      <span class="plain">
        <Icon />
      </span>
    {/each}
  </p>
  <br />
</Report>

<Report handle="VSSAY">
  <br />
  <p class="text x3">
    {#each ICONS as { Icon }}
      <span class="plain">
        <Icon />
      </span>
    {/each}
  </p>
  <br />
</Report>

<Report handle="GSAY">
  <br />
  <p class="text x3">
    {#each ICONS as { Icon }}
      <span class="plain">
        <Icon />
      </span>
    {/each}
  </p>
  <br />
</Report>

<Report handle="VGSAY">
  <br />
  <p class="text x3">
    {#each ICONS as { Icon }}
      <span class="plain">
        <Icon />
      </span>
    {/each}
  </p>
  <br />
</Report>

<Report handle="WSAY">
  <br />
  <p class="text x3">
    {#each ICONS as { Icon }}
      <span class="plain">
        <Icon />
      </span>
    {/each}
  </p>
  <br />
</Report>

<Report handle="XSAY">
  <br />
  <p class="text x3">
    {#each ICONS as { Icon }}
      <span class="plain">
        <Icon />
      </span>
    {/each}
  </p>
  <br />
</Report>

<style lang="scss">
.x3 {
  font-size: 3rem;
  line-height: 3.75rem;
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
