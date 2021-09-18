<script lang="ts">
import { onDestroy } from 'svelte'

import Viewport from './viewport.svelte'
import Manifest from './manifest.svelte'
import SafeMeasure from './safe-measure.svelte'

import { __BROWSER__ } from './device'
import areaBoxInit from './area-box'
import browserInit from './browser'

onDestroy(areaBoxInit())
onDestroy(browserInit())

export let ratio: number
export let isDefaultSafeArea: boolean

// subscribe initial event.
</script>

<Manifest />
<Viewport min={1.0} max={1.0} />
<SafeMeasure bind:ratio bind:isDefaultSafeArea />
