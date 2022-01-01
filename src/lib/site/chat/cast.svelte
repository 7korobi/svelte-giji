<script lang="ts">
import type { BookStory } from '$lib/pubsub/map-reduce'

import { deco } from './deco'

export let handle: string = 'VSSAY'
export let face_id: string = 'undef'
export let story: BookStory
</script>

<div class="report">
  <div class="chat {handle}" use:deco>
    <slot />
  </div>
</div>
