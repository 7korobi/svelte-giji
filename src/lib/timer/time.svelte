<script lang="ts">
import { distance } from './distance'
export let at: number | Date = new Date()

$: timer = distance(at)
$: iso = new Date(at).toISOString()
</script>

<time dateTime={iso}>
  {$timer.label}
</time>
