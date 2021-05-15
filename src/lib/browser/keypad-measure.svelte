<script lang="ts">
import type { SIZE } from '../common/config'

import { state, keypadSize } from './store'
import { __BROWSER__ } from './device'

$: setKeypadSize($keypadSize)

function setKeypadSize([width, height]: SIZE) {
  if (!__BROWSER__) return
  const { style } = document.documentElement
  style.setProperty('--keypad-width', `${width}px`)
  style.setProperty('--keypad-height', `${height}px`)
}
</script>
