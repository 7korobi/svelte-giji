<script lang="ts">
import { DAY, HOUR, MINUTE, WEEK } from '$lib/timer'

import { Zoom, Pen } from '$lib/pointer'
import { Time } from '$lib/timer'
import LongPress from '$lib/inline/LongPress.svelte'
import { Poll } from '$lib/storage'
import { Report, Post, Talk } from '$lib/chat'
import { HtmlArea } from '$lib/editor'
import browser from '$lib/browser'
import { __BROWSER__ } from '$lib/browser-device'

import site from '$lib/site'
import { faces } from '$lib/pubsub/poll'

import '../_app.svelte'

const { url } = site

const { viewSize, viewOffset, zoomSize, zoomOffset, zoomScale, safeSize, safeOffset } = browser
const bootAt = Date.now()

let hello = 'home'

let x
let y
let scale
</script>

<Report handle="SSAY">
  <h1>Welcome to SvelteKit</h1>
  <p><a sveltekit:prefetch href="/">ROOT</a></p>
  <p>Visit <a sveltekit:prefetch href="/demo/color">COLOR</a></p>
  <p>Visit <a sveltekit:prefetch href="/demo/icon">ICON</a></p>
</Report>

<Post handle="SSAY">
  <p>{hello}</p>
  <LongPress bind:value={hello} as="world" disabled>Hello World!</LongPress>

  <LongPress bind:value={hello} as="home">Hello Home!</LongPress>
  <LongPress bind:value={hello} as="home">Hello Home!</LongPress>

  <LongPress bind:value={hello} as="office">Hello Office!</LongPress>
  <LongPress bind:value={hello} as="office">Hello Office!</LongPress>

  <LongPress bind:value={hello} as="home">Hello Home!</LongPress>
  <LongPress bind:value={hello} as="home">Hello Home!</LongPress>

  <LongPress bind:value={hello} as="office">Hello Office!</LongPress>
  <LongPress bind:value={hello} as="office">Hello Office!</LongPress>
</Post>

<Post handle="TSAY">
  <p>
    view size : {$viewSize[0]} x {$viewSize[1]}
  </p>
  <p>
    zoom size : {$zoomSize[0]} x {$zoomSize[1]} ({$zoomScale})
  </p>
</Post>

<Report handle="VSSAY" />

<Talk handle="SSAY" face_id="c10">
  <Pen />
</Talk>

<Talk handle="SSAY" face_id="c21">
  <HtmlArea />
</Talk>

<Post handle="PSAY">
  <Zoom bind:x bind:y bind:scale>
    <hr />
    <h3>zoom offset</h3>
    <p>{x} {y} {scale}</p>
    <h3>window zoom offset</h3>
    <table>
      <tr>
        <td />
        <td>{$zoomOffset[0]}</td>
        <td />
      </tr>
      <tr>
        <td>{$zoomOffset[3]}</td>
        <td>{Math.floor($zoomScale * 10) / 10}</td>
        <td>{$zoomOffset[1]}</td>
      </tr>
      <tr>
        <td />
        <td>{$zoomOffset[2]}</td>
        <td />
      </tr>
    </table>
    <hr />
    <h3>view offset</h3>
    <table>
      <tr>
        <td />
        <td>{$viewOffset[0]}</td>
        <td />
      </tr>
      <tr>
        <td>{$viewOffset[3]}</td>
        <td />
        <td>{$viewOffset[1]}</td>
      </tr>
      <tr>
        <td />
        <td>{$viewOffset[2]}</td>
        <td />
      </tr>
    </table>
    <hr />
    <h3>safe offset</h3>
    <table>
      <tr>
        <td />
        <td>{$safeOffset[0]}</td>
        <td />
      </tr>
      <tr>
        <td>{$safeOffset[3]}</td>
        <td />
        <td>{$safeOffset[1]}</td>
      </tr>
      <tr>
        <td />
        <td>{$safeOffset[2]}</td>
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
    <hr />
  </Zoom>
</Post>

<Poll {...faces()} />

<style lang="scss">
@use "../../lib/common/_color" as *;

h1 {
  --test-hsla: #{hsla(100deg, 60%, 50%, 1)};
  --test-hsya: #{HSYA(100deg, 60%, 50%, 1)};
  --cr: #{contrastRank(red, white, 'ranks')};
}

table {
  text-align: center;
}
</style>
