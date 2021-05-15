<script lang="ts">
import Viewport from './viewport.svelte'
import Manifest from './manifest.svelte'
import KeypadMeasure from './keypad-measure.svelte'
import ZoomMeasure from './zoom-measure.svelte'
import ViewMeasure from './view-measure.svelte'
import SafeMeasure from './safe-measure.svelte'

import { __BROWSER__ } from './device'
import { state } from './store'
import areaBoxInit from './area-box'
import browserInit from './browser'
import { readable } from 'svelte/store'

const area = readable(state, areaBoxInit)
const browser = readable(state, browserInit)

export let ratio: number
export let isDefaultSafeArea: boolean

// subscribe initial event.
$area
$browser
</script>

<Manifest />
<Viewport min={1.0} max={1.0} />
<KeypadMeasure />
<ZoomMeasure />
<ViewMeasure />
<SafeMeasure bind:ratio bind:isDefaultSafeArea />
