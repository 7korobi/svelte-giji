<script lang="ts">
import { Operations } from '../pointer/tracker'
import type { TYPE } from './button'
import { className, tap } from './button'

const tracker = new Operations({ start, end })

export let value: any
export let as: any

export let type: TYPE = 'as'

let isPress = false

function start() {
  isPress = true
  return true
}

function end() {
  isPress = false
}

function animeEnd() {
  if (isPress) {
    value = tap(type, value, as)
  }
  isPress = false
}
</script>

<button
  class={className(type, as, value, isPress)}
  use:tracker.listener
  on:transitionend={animeEnd}>
  <span>①</span>
  <slot />
</button>

<style lang="scss">
button {
  transition-timing-function: ease-in-out;
  transition-duration: 0.3s;
  transition-property: background-color;

  background-color: silver;

  span {
    transition-property: transform;
    transition-timing-function: ease-in-out;
    transition-duration: 0.3s;

    transform-origin: center;
    transform: rotateZ(90deg);

    font-size: 2em;
    display: inline-block;
  }

  &:hover {
    span {
      transform: rotateZ(70deg);
    }
  }

  &.press {
    transition-duration: 1.5s;
    background-color: white;

    span {
      transition-duration: 1.5s;
      transform: rotateZ(0deg);
    }
  }
  &.active {
    transition-duration: 0.3s;
    background-color: white;

    span {
      transition-duration: 0.3s;
      transform: rotateZ(0deg);
    }
  }
}
</style>
