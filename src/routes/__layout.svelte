<script lang="ts">
import { session } from '$app/stores'

import fire from '$lib/fire'
import browser, { Browser, Viewport } from 'svelte-browser'
import { portal, __BROWSER__ } from 'svelte-petit-utils'

import * as Icon from '$lib/icon'

import { live } from '$lib/site'
import { Report } from '$lib/site/chat'
import { Btn } from '$lib/design'
import Export from '$lib/site/article/export.svelte'
import Footer from '$lib/site/article/footer.svelte'
import ThemeBtns from '$lib/site/block/theme-btns.svelte'
import { url, side, SideBits, toastframe, sideframe, summaryframe } from '$lib/site/store'

import './_app.svelte'

const { viewOffset } = browser

if (__BROWSER__) {
  fire.init(live.firebase)
}

/**
 * 携帯端末のセーフエリアを回避する比率。0.0 〜 1.0
 */
const SAFEAREA_RATIO = 1.0
const min = 1.0
const max = 2.0

$: console.log('session', $session)
$: offsetTop = welcomeTopHeight < $viewOffset[0] ? 0 : Math.floor(-0.4 * $viewOffset[0])
$: offsetFilm = Math.floor(-0.5 * $viewOffset[0])
$: offsetBottom = welcomeBottomHeight < $viewOffset[2] ? 0 : Math.floor(-0.4 * $viewOffset[2])

let welcomeTopHeight = 0
let welcomeBottomHeight = 0
</script>

<div class="page-active-bg">
  <div class="toastframe" use:toastframe.slot>
    <Report handle="ADMIN">
      <div class="text fine mono">
        <p class="r">
          <span class="limit1-ok">o</span>
          <span class="limit1-ng">-</span>
          <span class="limit2-ok">o</span>
          <span class="limit2-ng">-</span>
          <span class="limit3-ok">o</span>
          <span class="limit3-ng">-</span>
        </p>
        <p
          data-tooltip="不十分な画面幅にあわせ、折返し表示をしています"
          class="limit1-ng tooltip-left"
        >
          折返中
        </p>
      </div>
    </Report>
  </div>
  <div class="sideframe icons form" use:sideframe.slot>
    <div class="area">
      <Btn
        type="toggle"
        as={SideBits.posi.Expand}
        bind:value={$side}
        class="item-half tooltip-left"
        data-tooltip="詳細情報を拡げる操作の ON / OFF"
      >
        <Icon.Expand />
      </Btn>
    </div>
    <div class="area">
      <Btn
        expand
        type="toggle"
        as={SideBits.posi.SwipeOn}
        bind:value={$side}
        class="item-half tooltip-left"
        data-tooltip="ページ一覧を一列にする / 折り返す"
      >
        <Icon.SwipeOn />
      </Btn>
    </div>
    <br />
    <br />
    <div class="area" on:click={() => window.scrollTo({ top: 0 })}>
      <button
        data-tooltip="一番上までスクロール"
        class:active={!!$viewOffset[0]}
        class="item tooltip-left"
      >
        <Icon.GoTop />
      </button>
    </div>
    <div class="area">
      <button data-tooltip="マークする" class="item tooltip-left">
        <Icon.MarkerOn />
      </button>
    </div>
    <div class="area">
      <Btn
        expand
        type="toggle"
        as={SideBits.posi.TimelineClock}
        bind:value={$side}
        data-tooltip="今見ている投稿に関する情報"
        class="item tooltip-left"
      >
        <Icon.TimelineClock />
      </Btn>
    </div>
    <div class="area">
      <Btn
        expand
        type="toggle"
        as={SideBits.posi.Tree}
        bind:value={$side}
        data-tooltip="今見ている投稿と繋がる投稿"
        class="item tooltip-left"
      >
        <Icon.Tree />
      </Btn>
    </div>
    <div class="area">
      <Btn
        expand
        type="toggle"
        as={SideBits.posi.TocOn}
        bind:value={$side}
        data-tooltip="他の日付へ移動、検索など"
        class="item tooltip-left"
      >
        <Icon.TocOn />
      </Btn>
    </div>
    <div class="area">
      <Btn
        expand
        type="toggle"
        as={SideBits.posi.UsersOn}
        bind:value={$side}
        data-tooltip="キャラクターの一覧、ステータス等を確認"
        class="item tooltip-left"
      >
        <Icon.UsersOn />
      </Btn>
    </div>
  </div>
  <div class="summaryframe impose" use:summaryframe.slot />

  <div
    class="welcome"
    bind:offsetHeight={welcomeTopHeight}
    style={`background-position: left 50% top ${offsetTop}px;`}
  >
    <Export />
    <h1 class="title-bar"><a href={$url.top}>人狼議事</a></h1>
    <ThemeBtns />
    <div class="outframe filmline" style={`background-position: ${offsetFilm}px 0;`}>
      <div class="contentframe">
        <span class="filmend" />
      </div>
    </div>
  </div>
  <div class="page-active">
    <div class="outframe">
      <div class="contentframe">
        <div class="inframe" style={`background-position: 0 ${offsetFilm}px;`}>
          <slot>ここにコンテンツを書きます。</slot>
        </div>
      </div>
      <div class="center-left" />
      <div class="center-right" />
    </div>
  </div>
  <div
    class="welcome"
    bind:offsetHeight={welcomeBottomHeight}
    style={`background-position: left 50% bottom ${offsetBottom}px;`}
  >
    <div class="outframe filmline" style={`background-position: ${-offsetFilm}px 0;`}>
      <div class="contentframe">
        <span class="filmstart" />
      </div>
    </div>
    <ThemeBtns />
    <Footer />
  </div>
</div>

<Browser ratio={SAFEAREA_RATIO} isDefaultSafeArea={true} />
<Viewport {min} {max} />
<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="icon" type="image/png" sizes="196x196" href="/favicon-196.png" />

  <meta name="msapplication-square70x70logo" content="/mstile-icon-128.png" />
  <meta name="msapplication-square150x150logo" content="/mstile-icon-270.png" />
  <meta name="msapplication-square310x310logo" content="/mstile-icon-558.png" />
  <meta name="msapplication-wide310x150logo" content="/mstile-icon-558-270.png" />

  <link rel="apple-touch-icon" href="/apple-icon-180.png" />

  <meta name="apple-mobile-web-app-capable" content="yes" />
</svelte:head>

<style lang="scss">
.welcome {
  -o-object-fit: cover;
  object-fit: cover;
  background-size: cover;
  background-image: url('//gijilog.web.app/images/bg/fhd-giji.png');
}

.title-bar {
  height: 140px;
  text-align: center;
  transform-origin: center bottom;
  line-height: 140px;
}

.filmline {
  margin: 0;
  background-repeat: repeat-x;
  .contentframe {
    background-image: none;
    height: 0;
  }
}

.sideframe {
  margin: 0 0 10px auto;
  background: transparent;

  text-align: right;
  .area {
    text-align: right;
    width: 40px;

    :global(.item-half),
    :global(.item) {
      box-sizing: content-box;
      flex-basis: auto;
      text-align: center;
      margin: 2px 0;
      font-size: 18px;
      border-radius: 8px 0 0 8px;
      width: 12px;
    }

    :global(.item-half) {
      height: 30px;
    }

    :global(.item) {
      height: 60px;
    }

    :hover,
    :active,
    :global(.active) {
      border-radius: 24px 0 0 24px;
      width: 18px;
    }
  }
}
.writeframe,
.outframe {
  width: 100vw;
}

.outframe .contentframe .inframe {
  min-height: calc(100vh - 40em - 300px);
}

.writeframe {
  top: 0;
  box-sizing: content-box;
}

.contentframe {
  background-attachment: scroll;

  .inframe {
    padding: 10px 0;
    background-repeat: repeat-y;
    background-attachment: local;
  }
}

.summaryframe {
  transition-property: border-color, width;
  transition-duration: 0.3s;
  left: 0;
  bottom: 0;
}

.sideframe {
  right: 0;
  bottom: 0;
}

.toastframe {
  left: 0;
  top: 0;
}

.summaryframe,
.toastframe,
.sideframe {
  .talk > .baloon,
  .talk > .portrate {
    display: none;
  }
}
.summaryframe:not(:hover),
.toastframe:not(:hover),
.sideframe:not(:hover) {
  .detail {
    display: none;
  }
}

.summaryframe,
.outframe,
.fullframe,
.contentframe {
  padding: 0;
  box-sizing: content-box;
}

.summaryframe,
.toastframe,
.sideframe,
.editframe,
.writeframe {
  position: fixed;
  td,
  th {
    border-style: none;
    border-width: 0;
  }
}

.toastframe,
.writeframe,
.center-left,
.center-right {
  pointer-events: none;
}

.summaryframe,
.sideframe,
.editframe {
  pointer-events: auto;
}

.center-left,
.center-right {
  position: fixed;
  top: 50vh;
  width: 4vw;
  border-bottom-width: 3px;
  border-bottom-style: solid;
}

.center-left {
  left: 0;
}

.center-right {
  right: 0;
}
</style>
