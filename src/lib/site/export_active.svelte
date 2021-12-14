<script lang="ts">
import type { FOLDER_IDX } from '$lib/pubsub/map-reduce'
import { Folders } from '$lib/pubsub/map-reduce'
import { story_reduce } from '$lib/pubsub/book/query'
import { __BROWSER__ } from '$lib/browser-device'

export let folder_idx: FOLDER_IDX

$: folder = Folders.find(folder_idx)
</script>

<p>
  <a href={folder.top_url}
    >{folder.config.cfg.MAX_VILLAGES}村:{folder_idx}
    {#if __BROWSER__}
      {#if $story_reduce.prologue[folder_idx]}
        <sup class="LSAY">{$story_reduce.prologue[folder_idx]}</sup>
      {/if}
      {#if $story_reduce.progress[folder_idx]}
        <sup class="SSAY">{$story_reduce.progress[folder_idx]}</sup>
      {/if}
    {/if}
  </a>
</p>
