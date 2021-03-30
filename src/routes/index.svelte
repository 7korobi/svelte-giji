<script lang="ts">
import { Calendar } from 'fancy-date/lib/sample'
import { isOnline } from '$lib/browser'
import { Bits } from '$lib/bits'

import Poll from '$lib/data/Poll.svelte'

import Chat from '$lib/chat/Chat.svelte'
import Banner from '$lib/chat/Banner.svelte'

import KeyBoard from '$lib/head/KeyBoard.svelte'
import FullScreen from '$lib/head/FullScreen.svelte'

// import EditorArea from '$lib/form/EditorArea.svelte'

import Btn from '$lib/inline/Btn.svelte'

import Scroll from '$lib/block/Scroll.svelte'
import Diagram from '$lib/block/Diagram.svelte'

export let name: string

let fs
let c = 0
let f = 32
let texts = []
let rubys = []
let count = 0
let rest = 'th'
let btnColor = 'black'
let data = []

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
  'droop',

  'GAIM',
  'ELSE',
  'AIM',
  'PSAY',
  'HSAY',
  'hide',
  'TSAY',
  'private',

  'GSAY',
  'VGSAY',
  'SSAY',
  'MSAY',
  'VSSAY',

  'FSAY',
  'XSAY',
  'LSAY',
  'WSAY'
]

const logColors = [
  'title-bar',
  'welcome-links',
  'progress',
  'prologue',
  'BRONZE',
  'footer',
  'header',
  'btns',
  'chrblank',
  'welcome-btns',

  'ADMIN',
  'TITLE',
  'MAKER',

  'icons',
  'public',
  'private',

  'FSAY',
  'XSAY',
  'LSAY',
  'WSAY',

  'HSAY',
  'hide',
  'TSAY',

  'GSAY',
  'GAIM',
  'VGSAY',
  'SSAY',
  'MSAY',
  'AIM',
  'VSSAY',
  'PSAY',

  'ELSE'
]

const GameBits = new Bits(['A', 'B', 'C', 'D'], {
  AB: ['B', 'A'],
  CD: ['C', 'D'],
  BC: ['AB', 'C']
})
let games = 0

let icons = [
  { v: 'c01', roll: 0, x: -200, y: -100, label: '花売り メアリー' },
  { v: 'c02', roll: 0, x: 200, y: -100, label: '村長をそんちょうしよう！' },
  { v: 'c03', roll: 90, x: -200, y: 100, label: '1st' },
  { v: 'c04', roll: 180, x: 0, y: 180, label: '' },
  { v: 'c05', roll: 270, x: 200, y: 100, label: '3rd' }
]
let lines = [
  { v: 'c01', w: 'c02', vpos: 0, wpos: 0, line: ' = ', label: 'ふれんず' },
  { v: 'c01', w: 'c02', vpos: 180, wpos: 0, line: ' ->', label: 'フレンズ' },
  { v: 'c01', w: 'c02', vpos: 0, wpos: 180, line: '<- ', label: 'ふれんず' },
  { v: 'c01', w: 'c02', vpos: 180, wpos: 180, line: 'o.x', label: '' }
]
let clusters = [{ vs: ['c01'], label: 'グループ' }]

// $: console.log(group, core, mode, rect)

$: rest = [undefined, 'st', 'nd', 'rd'][count] ?? 'th'

$: if (count < 9) {
  btnColor = 'blue'
} else {
  btnColor = 'gray'
}

setTimeout(() => {
  const data = Calendar.平気法
    .format(new Date().getTime(), 'Gy年 d日|Mo Ho mo ao Ao Eo Fo No Zo|Mr Hr mr ar Ar Er Fr Nr Zr')
    .split('|')
  const ymd = data[0].split(' ')
  texts = data[1].split(' ')
  rubys = data[2].split(' ')
  rubys = ['', rubys[0], '', ...rubys.slice(1)]
  texts = [ymd[0], texts[0], ymd[1], ...texts.slice(1)]
}, 2000)

async function reqPlan() {
  const req = await fetch('https://giji-api.duckdns.org/api/plan/progress')
  return (data = await req.json())
}

function keyCombo(e) {
  //console.log(e)
}

function keyDown(e) {
  //console.log(e)
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

function intersection(e) {
  console.log(e.detail)
}
</script>

{#each logColors as color}
  <Banner>
    <h3>{color}</h3>
  </Banner>
  <Scroll name={color} on:change={intersection}>
    <FullScreen bind:toggle={fs}>
      <Chat show="report" handle={color}>
        <h1 class="c">Hello {name}! {$isOnline ? 'online' : 'offline'}</h1>
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
                <rt>{rubys[idx]}</rt></ruby>
            {:else}{text}{/if}
          {/each}
        </p>
        <p>
          Visit the
          <a href="https://svelte.dev/tutorial">Svelte tutorial</a>
          to learn how to build Svelte apps.
        </p>
      </Chat>
    </FullScreen>
  </Scroll>
  <Scroll name=".2" on:change={intersection}>
    <Scroll name=".2.1" on:change={intersection}>
      <Chat show="post" handle={color}>
        <button on:click={handleClick}
          >Clicked
          <span style={`btnColor: ${btnColor}`}>{count}{rest}</span></button>

        <!-- https://github.com/eugenkiss/7guis/wiki#temperature-converter -->
        <input value={c} on:input={(e) => byC(e.currentTarget.value)} type="number" />
        °c =
        <input value={f} on:input={(e) => byF(e.currentTarget.value)} type="number" />
        °f<style>
        input {
          width: 5em;
        }
        </style></Chat>
    </Scroll>
    <Scroll name=".2.2" on:change={intersection}>
      <Chat show="report" handle={color}>
        <Diagram {icons} {lines} {clusters} />
      </Chat>
    </Scroll>
  </Scroll>

  <Scroll name=".3" on:change={intersection}>
    <Scroll name=".3.2" on:change={intersection}>
      <Chat show="talk" handle={color} face_id="t10" head="abc">
        <h1 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h1>
        <hr />
        <h2 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h2>
        <hr />
        <h3 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h3>
        <hr class="stripe" />
        <hr class="blank" />
        <hr class="stripe" />
        <h4 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h4>
        <hr class="footnote" />
        <h5 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h5>
        <hr class="footnote" />
        <h6 class="c">こんにちは、Svelte世界！　Hello SVELTE world!</h6>
      </Chat>
    </Scroll>
  </Scroll>
{/each}
<KeyBoard on:key={keyDown} on:combo={keyCombo} />
<Poll timer="6h" api={reqPlan} />
