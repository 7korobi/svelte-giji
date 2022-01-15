<script lang="ts">
import { DAY, HOUR, MINUTE, WEEK } from '$lib/timer'

import { Zoom, Pen } from '$lib/pointer'
import { Time } from '$lib/timer'
import Poll from '$lib/storage/poll.svelte'
import { HtmlArea } from '$lib/editor'
import browser from '$lib/browser'
import { __BROWSER__ } from '$lib/common'

import { faces } from '$lib/pubsub/poll'
import { LongPress } from '$lib/design'
import { Report, Post, Talk } from '$lib/site/chat'

import '../_app.svelte'

import {
  hira2kata,
  kata2hira,
  swapKana,
  devoice,
  semiVoice,
  fullVoice,
  small,
  ascii,
  smallcap,
  sup,
  sub,
  rune,
  bbb,
  cursive,
  cursiveBold,
  fraktur,
  region,
  square,
  squared,
  squareBlack,
  circled,
  circleBlack,
  hex,
  digit
} from '$lib/unicode'

let value = `
ココ2ndScr120P60P22.2FREECOOL5.17.1HDRHI-RESLOSSRESSSHVUHDVODPPVNEWSOSHCHVMVSDSSWCCLIDNGOKUPVS3D2K4K8Kサデ多解天交映無料前後再新初終生販声吹演投捕一二三遊左中右指走打禁空合満有月申割営配手字双ABCDEFGHIJKLMNOPQRSTUVWXYZ xP IC PA SA AB
+-*/{}[]<>⊂⊃⊆⊇
01234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950一二三四五六七八九十月火水木金土日株有社名特財祝労秘男女適優印注項休写正上中下左右医宗学監企資協夜アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲ+-*/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
Welcome to SVELTE KIT
となりのきゃくはよくかきくうきゃくだ
`

const { viewSize, viewOffset, zoomSize, zoomOffset, zoomScale, safeOffset } = browser
const bootAt = Date.now()

let hello = 'home'

let x: number
let y: number
let scale: number
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

<Post handle="SSAY">
  <textarea bind:value />
  <hr />
  <p><label>cursive</label>{cursive(value)}</p>
  <hr />
  <p><label>cursiveBold</label>{cursiveBold(value)}</p>
  <hr />
  <p><label>fraktur</label>{fraktur(value)}</p>
  <hr />
  <p><label>region</label>{region(value)}</p>
  <hr />
  <p><label>square</label>{square(value)}</p>
  <hr />
  <p><label>squared</label>{squared(value)}</p>
  <hr />
  <p><label>squareBlack</label>{squareBlack(value)}</p>
  <hr />
  <p><label>circleBlack</label>{circleBlack(value)}</p>
  <hr />
  <p><label>circled</label>{circled(value)}</p>
  <hr />
  <p><label>bbb</label>{bbb(value)}</p>
  <hr />
  <p><label>rune</label>{rune(value)}</p>
  <hr />
  <p><label>sup</label>{sup(value)}</p>
  <hr />
  <p><label>smallcap</label>{smallcap(value)}</p>
  <hr />
  <p><label>sub</label>{sub(value)}</p>
  <hr />
  <p><label>ascii</label>{ascii(value)}</p>
  <hr />
  <p><label>small</label>{small(value)}</p>
  <hr />
  <p><label>fullVoice</label>{fullVoice(value)}</p>
  <hr />
  <p><label>semiVoice</label>{semiVoice(value)}</p>
  <hr />
  <p><label>devoice</label>{devoice(value)}</p>
  <hr />
  <p><label>swapKana</label>{swapKana(value)}</p>
  <hr />
  <p><label>hira2kata</label>{hira2kata(value)}</p>
  <hr />
  <p><label>kata2hira</label>{kata2hira(value)}</p>
  <hr />
  <p><label>hex</label>{hex(value)}</p>
  <hr />
  <p><label>digit</label>{digit(value)}</p>
  <hr />
</Post>

<Poll {...faces()} />

<style lang="scss">
@use "../../lib/common/color" as *;

h1 {
  --test-hsla: #{hsla(100deg, 60%, 50%, 1)};
  --test-hsya: #{HSYA(100deg, 60%, 50%, 1)};
  --cr: #{contrastRank(red, white, 'ranks')};
}

table {
  text-align: center;
}
</style>
