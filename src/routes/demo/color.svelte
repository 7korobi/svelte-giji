<script lang="ts">
import type { Line, Icon, Cluster } from 'svelte-pointer-tracker'
import { Scroll } from 'svelte-scroll-observe'
import { Diagram } from 'svelte-pointer-tracker'

import { Btn } from '$lib/design'
import { Bits } from 'svelte-petit-utils'
import { Chat, Banner, Report } from '$lib/site/chat'

// import EditorArea from '$lib/form/EditorArea.svelte'

import '../_app.svelte'

let c = 0
let f = 32
let texts = []
let rubys = []
let count = 0
let rest = 'th'
let btnColor = 'black'

const potofColors = [
  'DEL_M',
  'DEL_S',
  'suddendead',
  'leave',

  'LONEWOLF',
  'LOVER',
  'executed',
  'HATER',
  'PIXI',
  'GURU',
  'EVIL',
  'HUMAN',
  'live',
  'juror',

  'NONE',
  'DISH',
  'MOB',
  'WOLF',
  'mob',
  'visiter',
  'grave',
  'alive',
  'suicide',
  'victim',
  'cursed',
  'feared',
  'droop'
]

const logColors = [
  'TITLE',
  'ADMIN',
  'MAKER',

  'SSAY',
  'MSAY',
  'AIM',
  'VSSAY',

  'TSAY',

  'GSAY',
  'GAIM',
  'VGSAY',

  'WSAY',
  'XSAY',
  'PSAY',

  'welcome-btns',
  'welcome-links',
  'title-bar',
  'footer',
  'header',

  'btns',
  'icons',
  'hide',

  'public',
  'private',
  'progress',
  'prologue',

  'BRONZE',
  'FSAY',
  'LSAY',
  'HSAY',
  'ELSE'
]

const GameBits = new Bits(['A', 'B', 'C', 'D'], {
  AB: ['B', 'A'],
  CD: ['C', 'D'],
  BC: ['AB', 'C']
})
let games = 1

let icons: Icon[] = [
  { v: 'c01', roll: 0, x: -200, y: -100, label: '花売り メアリー' },
  { v: 'c02', roll: 0, x: 200, y: -100, label: '村長をそんちょうしよう！' },
  { v: 'c03', roll: 90, x: -200, y: 100, label: '1st' },
  { v: 'c04', roll: 180, x: 0, y: 180, label: '' },
  { v: 'c05', roll: 270, x: 200, y: 100, label: '3rd' }
]
let lines: Line[] = [
  { v: 'c01', w: 'c02', vpos: 0, wpos: 0, line: ' = ', label: 'ふれんず' },
  { v: 'c01', w: 'c02', vpos: 180, wpos: 0, line: ' ->', label: 'フレンズ' },
  { v: 'c01', w: 'c02', vpos: 0, wpos: 180, line: '<- ', label: 'ふれんず' },
  { v: 'c01', w: 'c02', vpos: 180, wpos: 180, line: 'o.x', label: '' }
]
let clusters: Cluster[] = [{ vs: ['c01'], label: 'グループ' }]

// $: console.log(group, core, mode, rect)

$: rest = [undefined, 'st', 'nd', 'rd'][count] ?? 'th'

$: if (count < 9) {
  btnColor = 'blue'
} else {
  btnColor = 'gray'
}

function handleClick() {
  count++
}

function byC(str: string) {
  c = +str
  f = +(32 + (9 / 5) * c).toFixed(1)
}

function byF(str: string) {
  f = +str
  c = +((5 / 9) * (f - 32)).toFixed(1)
}
</script>

<Report handle="SSAY">
  <h1>Welcome to SvelteKit</h1>
  <p><a sveltekit:prefetch href="/">ROOT</a></p>
  <p>Visit <a sveltekit:prefetch href="/demo">DEMO</a></p>
</Report>

<Scroll name="chrblank">
  <Banner>
    <h3>chrblank</h3>
  </Banner>
  <Chat show="report" handle="chrblank">
    <Diagram {icons} {lines} {clusters} edit={true} />
    <p>on : +@ ~@</p>
    <p>
      {#each GameBits.labels as game (game)}
        <Btn type="on" bind:value={games} as={GameBits.posi[game]}>
          {game}
        </Btn>
      {/each}
      {#each GameBits.labels as game (game)}
        <Btn type="on" bind:value={games} as={GameBits.nega[game]}>
          {game}
        </Btn>
      {/each}
    </p>
    <p>off : +@ ~@</p>
    <p>
      {#each GameBits.labels as game (game)}
        <Btn type="off" bind:value={games} as={GameBits.posi[game]}>
          {game}
        </Btn>
      {/each}
      {#each GameBits.labels as game (game)}
        <Btn type="off" bind:value={games} as={GameBits.nega[game]}>
          {game}
        </Btn>
      {/each}
    </p>
    <p>xor : +@ ~@</p>
    <p>
      {#each GameBits.labels as game (game)}
        <Btn type="xor" bind:value={games} as={GameBits.posi[game]}>
          {game}
        </Btn>
      {/each}
      {#each GameBits.labels as game (game)}
        <Btn type="xor" bind:value={games} as={GameBits.nega[game]}>
          {game}
        </Btn>
      {/each}
    </p>
    <p>toggle : +@ ~@</p>
    <p>
      {#each GameBits.labels as game (game)}
        <Btn type="toggle" bind:value={games} as={GameBits.posi[game]}>
          {game}
        </Btn>
      {/each}
      {#each GameBits.labels as game (game)}
        <Btn type="toggle" bind:value={games} as={GameBits.nega[game]}>
          {game}
        </Btn>
      {/each}
    </p>
    <p>set : +@ ~@</p>
    <p>
      {#each GameBits.labels as game (game)}
        <Btn type="set" bind:value={games} as={GameBits.posi[game]}>
          {game}
        </Btn>
      {/each}
      {#each GameBits.labels as game (game)}
        <Btn type="set" bind:value={games} as={GameBits.nega[game]}>
          {game}
        </Btn>
      {/each}
    </p>
    <p>as : +@ ~@</p>
    <p>
      {#each GameBits.labels as game (game)}
        <Btn type="as" bind:value={games} as={GameBits.posi[game]}>
          {game}
        </Btn>
      {/each}
      {#each GameBits.labels as game (game)}
        <Btn type="as" bind:value={games} as={GameBits.nega[game]}>
          {game}
        </Btn>
      {/each}
    </p>
    <hr class="blank" />
    <p>
      {#each texts as text, idx (text)}
        {#if rubys[idx]}
          <ruby
            >{text}
            <rt>{rubys[idx]}</rt></ruby
          >
        {:else}{text}{/if}
      {/each}
    </p>
  </Chat>
</Scroll>

{#each [...potofColors, ...logColors] as color}
  <Banner>
    <h3>{color}</h3>
  </Banner>
  <Scroll name=".1">
    <Scroll name=".1.1">
      <Chat show="post" handle={color}>
        <button on:click={handleClick}
          >Clicked
          <span style={`btnColor: ${btnColor}`}>{count}{rest}</span></button
        >

        <!-- https://github.com/eugenkiss/7guis/wiki#temperature-converter -->
        <input value={c} on:input={(e) => byC(e.currentTarget.value)} type="number" />
        °c =
        <input value={f} on:input={(e) => byF(e.currentTarget.value)} type="number" />
        °f<style>
        input {
          width: 5em;
        }
        </style></Chat
      >
    </Scroll>
  </Scroll>
{/each}

{#each logColors as color}
  <Banner>
    <h3>{color}</h3>
  </Banner>
  <Scroll name={color}>
    <Chat show="report" handle={color}>
      <p>
        toggle
        {#each GameBits.labels as game (game)}
          <Btn type="toggle" bind:value={games} as={GameBits.posi[game]}>
            {game}
          </Btn>
        {/each}
      </p>
      <p>
        set
        {#each GameBits.labels as game (game)}
          <Btn type="set" bind:value={games} as={GameBits.posi[game]}>
            {game}
          </Btn>
        {/each}
      </p>
      <p>
        as
        {#each GameBits.labels as game (game)}
          <Btn type="as" bind:value={games} as={GameBits.posi[game]}>
            {game}
          </Btn>
        {/each}
      </p>
      <hr class="blank" />
      <p>
        {#each texts as text, idx (text)}
          {#if rubys[idx]}
            <ruby
              >{text}
              <rt>{rubys[idx]}</rt></ruby
            >
          {:else}{text}{/if}
        {/each}
      </p>
    </Chat>
  </Scroll>
{/each}

{#each logColors as color, idx}
  <Banner>
    <h3>{color}</h3>
  </Banner>
  <Scroll name=".2">
    <Scroll name=".2.1">
      <Chat show="report" handle={color}>
        <Diagram {icons} {lines} {clusters} edit={!!(idx % 2)} />
      </Chat>
    </Scroll>
  </Scroll>
{/each}

{#each logColors as color}
  <Banner>
    <h3>{color}</h3>
  </Banner>
  <Scroll name=".3">
    <Scroll name=".3.1">
      <Chat show="talk" handle={color} face_id="t10" name="abc" to="def" deco="head mono">
        <p class="c">こんにちは、Svelte世界！　Hello SVELTE world!</p>
        <p class="c">こんにちは、Svelte世界！　Hello SVELTE world!</p>
        <p class="c">こんにちは、Svelte世界！　Hello SVELTE world!</p>
        <hr class="stripe" />
        <p class="c">こんにちは、Svelte世界！　Hello SVELTE world!</p>
        <p class="c">こんにちは、Svelte世界！　Hello SVELTE world!</p>
        <p class="c">こんにちは、Svelte世界！　Hello SVELTE world!</p>
      </Chat>
      <Chat show="talk" handle={color} face_id="t10" name="abc">
        <p class="c">こんにちは、Svelte世界！　Hello SVELTE world!</p>
        <p class="c">こんにちは、Svelte世界！　Hello SVELTE world!</p>
        <h6 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h6>
        <hr />
        <h5 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h5>
        <hr />
        <h4 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h4>
        <hr class="stripe" />
        <hr class="blank" />
        <hr class="stripe" />
        <h3 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h3>
        <hr class="footnote" />
        <h2 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h2>
        <hr class="footnote" />
        <h1 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h1>
      </Chat>
    </Scroll>
  </Scroll>
{/each}
