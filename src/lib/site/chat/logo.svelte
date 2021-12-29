<script lang="ts">
import type { BookStory } from '$lib/pubsub/map-reduce'
import Mention from '../inline/mention.svelte'
import { deco } from './deco'

export let handle: string = 'VSSAY'
export let story: BookStory
</script>

<div class="report">
  <div class="chat {handle}" use:deco>
    <p class="name">
      {story._id} by {story.sow_auth_id}
    </p>
    <hr />
    <br />
    <h1 class="c">{@html story.name}</h1>
    <br />
    <hr class="stripe" />
  </div>
</div>
