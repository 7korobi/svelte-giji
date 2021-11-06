<script lang="ts">
import type { FOLDER_IDX } from '$lib/pubsub/map-reduce'
import { Folders } from '$lib/pubsub/map-reduce'
import Summary from '$lib/pubsub/join/summary.svelte'
import { StorySummary } from '$lib/pubsub/client'

export let folder_idx: FOLDER_IDX

$: folder = Folders.find(folder_idx)
$: deco = 'EVIL'
</script>

<Summary />
<p>
  <a href={folder.top_url} class={deco}
    >{folder.config.cfg.MAX_VILLAGES}村:{folder_idx}<sup>1</sup></a>
</p>
