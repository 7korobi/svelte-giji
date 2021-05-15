<script lang="ts">
import type { OFFSET, SIZE } from '../common/config'

import { state, zoomScale, zoomOffset, zoomSize } from './store'
import { __BROWSER__ } from './device'

$: setZoomOffset($zoomOffset)
$: setZoomSize($zoomSize)

function setZoomOffset([top, right, bottom, left]: OFFSET) {
  if (!__BROWSER__) return
  const { style } = document.documentElement
  style.setProperty('--zoom-top', `${top}px`)
  style.setProperty('--zoom-right', `${right}px`)
  style.setProperty('--zoom-bottom', `${bottom}px`)
  style.setProperty('--zoom-left', `${left}px`)
}

function setZoomSize([width, height]: SIZE) {
  if (!__BROWSER__) return
  const { style } = document.documentElement
  style.setProperty('--zoom-width', `${width}px`)
  style.setProperty('--zoom-height', `${height}px`)
  style.setProperty('--zoom-in', `${$zoomScale}`)
  style.setProperty('--zoom-out', `${1 / $zoomScale}`)
}
</script>
