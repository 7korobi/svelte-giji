<script lang="ts">
import { onDestroy } from 'svelte'

import SafeMeasure from './safe-measure.svelte'

import { __BROWSER__ } from '$lib/browser-device'
import areaBoxInit from './area-box'
import browserInit from './browser'

onDestroy(areaBoxInit())
onDestroy(browserInit())

export let ratio: number
export let isDefaultSafeArea: boolean

// subscribe initial event.
</script>

<SafeMeasure bind:ratio bind:isDefaultSafeArea />
