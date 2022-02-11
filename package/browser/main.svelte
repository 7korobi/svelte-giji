<script>
import { onDestroy } from 'svelte';
import SafeMeasure from './safe-measure.svelte';
import 'svelte-petit-utils';
import areaBoxInit from './area-box';
import browserInit from './browser';
onDestroy(areaBoxInit());
onDestroy(browserInit());
export let ratio;
export let isDefaultSafeArea;
// subscribe initial event.
</script>

<SafeMeasure bind:ratio bind:isDefaultSafeArea />
