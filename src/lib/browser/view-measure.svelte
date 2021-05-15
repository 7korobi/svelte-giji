<script lang="ts">
import type { OFFSET, SIZE } from '../common/config'

import { state, viewOffset, viewSize } from './store'
import { __BROWSER__ } from './device'

$: setViewOffset($viewOffset)
$: setViewSize($viewSize)

function setViewOffset([top, right, bottom, left]: OFFSET) {
  if (!__BROWSER__) return
  const { style } = document.documentElement
  style.setProperty('--view-top', `${top}px`)
  style.setProperty('--view-right', `${right}px`)
  style.setProperty('--view-bottom', `${bottom}px`)
  style.setProperty('--view-left', `${left}px`)
}

function setViewSize([width, height]: SIZE) {
  if (!__BROWSER__) return
  const { style } = document.documentElement
  style.setProperty('--view-width', `${width}px`)
  style.setProperty('--view-height', `${height}px`)
}
</script>
