<script lang="ts">
import { Operations } from '../pointer/tracker'
import type { TYPE } from './button'
import { className, tap } from './button'

const tracker = new Operations({ start, end })

export let value: any
export let as: any
export let type: TYPE = 'as'
export let disabled = false

let isPress = false

function start() {
  isPress = !disabled
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
  class:disabled
  class={className(type, as, value, isPress)}
  use:tracker.listener
  on:transitionend={animeEnd}>
  <span>①</span>
  <slot />
</button>

<style lang="scss">
button {
  --speed: 0.3s;
  --duration: 1.5s;
  transition-timing-function: ease-in-out;
  transition-duration: var(--speed);
  transition-property: background-color;

  background-color: silver;

  span {
    transition-property: transform;
    transition-timing-function: ease-in-out;
    transition-duration: var(--speed);

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

  &.disabled {
    background-color: silver;
    span {
      transition-duration: var(--speed);
      transform: rotateZ(100deg);
    }
  }
  &.press {
    transition-duration: var(--duration);
    background-color: white;

    span {
      transition-duration: var(--duration);
      transform: rotateZ(0deg);
    }
  }
  &.active {
    transition-duration: var(--speed);
    background-color: white;

    span {
      transition-duration: var(--speed);
      transform: rotateZ(0deg);
    }
  }
}
</style>
