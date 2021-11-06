<script lang="ts">
import { __BROWSER__ } from '$lib/browser/device'
import * as IconDic from '$lib/icon'
import { Report, Post, Talk } from '$lib/chat'

import '../_app.svelte'

const FONTS = [
  'icon-biohazard',
  'icon-casino',
  'icon-catwalk',
  'icon-drug',
  'icon-gun',
  'icon-moon',
  'icon-music',
  'icon-sun',
  'icon-sunrise',
  'icon-tropical',

  'icon-collapse',
  'icon-expand',
  'icon-go-top',
  'icon-key',
  'icon-marker-off',
  'icon-marker-on',
  'icon-pin',
  'icon-spinner',
  'icon-standby',
  'icon-swipe-LR',
  'icon-swipe-UD',
  'icon-swipe-down',
  'icon-swipe-left',
  'icon-swipe-off',
  'icon-swipe-on',
  'icon-swipe-right',
  'icon-swipe-up',
  'icon-timeline-alert',
  'icon-timeline-clock',
  'icon-timeline-help',
  'icon-timeline-minus',
  'icon-timeline-plus',
  'icon-timeline-remove',
  'icon-timeline-text',
  'icon-toc-off',
  'icon-toc-on',
  'icon-tree',
  'icon-users-off',
  'icon-users-on',
  'icon-zoom-in',
  'icon-zoom-out',

  'icon-CERO-A',
  'icon-CERO-B',
  'icon-CERO-C',
  'icon-CERO-D',
  'icon-CERO-Z',

  'logo-facebook',
  'logo-github',
  'logo-google',
  'logo-twitter',
  'logo-windows'
]

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

<Report handle="SSAY">
  <br />
  <article class="text x3">
    {#each FONTS as key}
      <span class="plain">
        <svg class="icon"><use xlink:href="#{key}" /></svg>
      </span>
    {/each}
  </article>
  <br />
  <article class="text x3">
    {#each FONTS as key}
      <span class="spin">
        <svg class="icon"><use xlink:href="#{key}" /></svg>
      </span>
    {/each}
  </article>
  <br />
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
