<script lang="ts">
import { Zoom, Pen } from '$lib/pointer'
import { viewSize, zoomSize, zoomOffset, zoomScale } from '$lib/browser/store'
import { Time } from '$lib/timer'
import { __BROWSER__ } from '$lib/browser/device'
import { DAY, HOUR, MINUTE, WEEK } from '$lib/timer/msec'
import LongPress from '$lib/inline/LongPress.svelte'

const bootAt = Date.now()

let hello = 'home'

let x
let y
let scale
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a sveltekit:prefetch href="/">ROOT</a></p>

<LongPress bind:value={hello} as="world" disabled>Hello World!</LongPress>

<LongPress bind:value={hello} as="home">Hello Home!</LongPress>

<LongPress bind:value={hello} as="office">Hello Office!</LongPress>

<p>
  view size : {$viewSize[0]} x {$viewSize[1]}
</p>
<p>
  zoom size : {$zoomSize[0]} x {$zoomSize[1]} ({$zoomScale})
</p>

{#if __BROWSER__}
  <!-- svelte-ignore missing-declaration -->
  <Pen />
  <Zoom bind:x bind:y bind:scale>
    <hr />
    <h3>zoom offset</h3>
    <p>{x} {y} {scale}</p>
    <table>
      <tr>
        <td />
        <td>{$zoomOffset[0]}</td>
        <td />
      </tr>
      <tr>
        <td>{$zoomOffset[3]}</td>
        <td />
        <td>{$zoomOffset[1]}</td>
      </tr>
      <tr>
        <td />
        <td>{$zoomOffset[2]}</td>
        <td />
      </tr>
    </table>
    <hr />
    <p>
      <Time at={bootAt - 31556736000 * 2 + 5000} />
      <Time at={bootAt - 31556736000} />
      <Time at={bootAt - 2629728000 * 2 + 5000} />
      <Time at={bootAt - 2629728000} />
      <Time at={bootAt - WEEK * 2 + 5000} />
      <Time at={bootAt - WEEK} />
      <Time at={bootAt - DAY * 2 + 5000} />
      <Time at={bootAt - DAY} />
      <Time at={bootAt - HOUR * 2 + 5000} />
      <Time at={bootAt - HOUR} />
      <Time at={bootAt - MINUTE} />
      <Time at={bootAt + 30000} />
      <Time at={bootAt + MINUTE} />
      <Time at={bootAt + HOUR} />
      <Time at={bootAt + HOUR * 2 - 5000} />
      <Time at={bootAt + DAY} />
      <Time at={bootAt + DAY * 2 - 5000} />
      <Time at={bootAt + WEEK} />
      <Time at={bootAt + WEEK * 2 - 5000} />
      <Time at={bootAt + 2629728000} />
      <Time at={bootAt + 2629728000 * 2 - 5000} />
      <Time at={bootAt + 31556736000} />
      <Time at={bootAt + 31556736000 * 2 - 5000} />
    </p>
  </Zoom>
{/if}

<style lang="scss">
table {
  text-align: center;
}
</style>
