<script lang="ts">
import { tickDistance } from './distance'
export let at: number | Date = new Date()

$: timer = tickDistance(at)
$: iso = new Date(at).toISOString()
</script>

<time dateTime={iso}>
  {$timer.label}
</time>
