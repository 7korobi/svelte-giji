<script lang="ts">
import { observe } from './observer'

export let onPeep = () => {
  console.warn('not implement onPeep')
}

let isGoal = false

const tracker = observe(['peep', 'hidden'], {
  change(ops) {
    if (!isGoal && ops.state === 'peep') {
      isGoal = true
    }
  }
})

onPeep
</script>

<div use:tracker.listener>
  <slot />
</div>
