<script lang="ts">
import fns_format from 'date-fns/format/index.js'
import ja from 'date-fns/locale/ja/index.js'
import { tickDistance } from './distance'

export let at: number | Date = new Date()
export let limit = '10年'
export let format = (at: Date) => fns_format(at, 'yy-MM-dd E HH:mm', { locale: ja })

$: timer = tickDistance(at, { limit, format })
$: iso = new Date(at).toISOString()
</script>

<time dateTime={iso}>
  {@html $timer.label}
</time>
