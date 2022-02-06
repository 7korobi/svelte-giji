<script lang="ts">
import fns_format from 'date-fns/format/index.js'
import ja from 'date-fns/locale/ja/index.js'
import { tickDistance } from './distance'

export let at: number | Date = new Date()
export let limit = '10年'
export let format = 'yy-MM-dd E HH:mm'

$: timer = tickDistance(at, { limit, format: (at: Date) => fns_format(at, format, { locale: ja }) })
$: iso = new Date(at).toISOString()
</script>

<time dateTime={iso}>
  {@html $timer.label}
</time>
