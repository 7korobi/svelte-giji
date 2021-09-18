<script lang="ts">
import { DAY, HOUR, MINUTE, WEEK } from '$lib/timer/msec'

import { Zoom, Pen } from '$lib/pointer'
import { Time } from '$lib/timer'
import { __BROWSER__ } from '$lib/browser'
import LongPress from '$lib/inline/LongPress.svelte'
import { Poll } from '$lib/fetch'
import { reqApi } from '$lib/site'
import { Report, Post, Talk } from '$lib/chat'
import { HtmlArea } from '$lib/editor'

import { browser } from '$lib/store'

import '../_app.svelte'

const { viewSize, zoomSize, zoomOffset, zoomScale } = browser
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
</Post>

<Poll timer="12h" shift="1h10m" api={reqApi.plan.progress()} />
<Poll timer="12h" shift="1h10m" api={reqApi.story.oldlogs()} />
<Poll timer="1y" api={reqApi.story.oldlog('allstar-1')} />
<Poll timer="1y" api={reqApi.story.oldlog('dais-9')} />

<Poll timer="12h" shift="1h10m" api={reqApi.aggregate.faces()} />
<Poll timer="12h" shift="1h10m" api={reqApi.aggregate.face('c01')} />

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
