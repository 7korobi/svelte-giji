<script lang="ts">
import { onDestroy } from 'svelte'

import Viewport from './viewport.svelte'
import Manifest from './manifest.svelte'
import KeypadMeasure from './keypad-measure.svelte'
import ZoomMeasure from './zoom-measure.svelte'
import ViewMeasure from './view-measure.svelte'
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
<KeypadMeasure />
<ZoomMeasure />
<ViewMeasure />
<SafeMeasure bind:ratio bind:isDefaultSafeArea />
