<script lang="ts">
import { session } from '$app/stores'

import fire from '$lib/fire'
import browser, { Browser, Viewport } from '$lib/browser'
import { __BROWSER__ } from '$lib/common'

import * as Icon from '$lib/icon'

import { live } from '$lib/site'
import { Report } from '$lib/site/chat'
import { Btn } from '$lib/design'
import Export from '$lib/site/article/export.svelte'
import Footer from '$lib/site/article/footer.svelte'
import ThemeBtns from '$lib/site/block/theme-btns.svelte'
import { url, side, SideBits } from '$lib/site/store'

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
      <div class="toastframe">
        <div class="inframe">
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
          <div class="icons form">
            <Btn
              type="toggle"
              as={SideBits.posi.Expand}
              bind:value={$side}
              class="item-half tooltip-left"
              data-tooltip="詳細情報を拡げる操作の ON / OFF"
            >
              <Icon.Expand />
            </Btn>
            <Btn
              type="toggle"
              as={SideBits.posi.SwipeOn}
              bind:value={$side}
              class="item-half tooltip-left"
              data-tooltip="ページ一覧を一列にする / 折り返す"
            >
              <Icon.SwipeOn />
            </Btn>
          </div>
        </div>
      </div>
      <div class="sideframe">
        <div class="inframe">
          <div class="icons form">
            <button
              data-tooltip="一番上までスクロール"
              class="item tooltip-left"
              on:click={() => window.scrollTo({ top: 0 })}
            >
              <Icon.GoTop />
            </button>
            <button data-tooltip="マークする" class="item tooltip-left">
              <Icon.MarkerOn />
            </button>
            <Btn
              type="toggle"
              as={SideBits.posi.TimelineClock}
              bind:value={$side}
              data-tooltip="今見ている投稿に関する情報"
              class="item tooltip-left"
            >
              <Icon.TimelineClock />
            </Btn>
            <Btn
              type="toggle"
              as={SideBits.posi.Tree}
              bind:value={$side}
              data-tooltip="今見ている投稿と繋がる投稿"
              class="item tooltip-left"
            >
              <Icon.Tree />
            </Btn>
            <Btn
              type="toggle"
              as={SideBits.posi.TocOn}
              bind:value={$side}
              data-tooltip="他の日付へ移動、検索など"
              class="item tooltip-left"
            >
              <Icon.TocOn />
            </Btn>
            <Btn
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
      </div>
      {#if $side & SideBits.posi.UsersOn}
        <div class="summaryframe impose">
          <div class="inframe header">
            <div class="swipe">
              <table>
                <tfoot class="TITLE form tb-btn">
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <tr>
                    <th colspan="3"><sup>(スクロールします)</sup></th>
                    <th><a class="active">日程</a></th>
                    <th><a class="btn">状態</a></th>
                    <th><a class="btn">促</a></th>
                    <th colspan="2">
                      <a class="btn">回数</a>
                      <a class="btn" title="字数 ÷ 回数">平均</a>
                      <a class="btn">字数</a>
                      <a class="btn" title="字数 ÷ 範囲">密度</a></th
                    >
                    <th>
                      <a class="btn">最初</a>
                      <a class="btn" title="最後 － 最初">範囲</a>
                      <a class="btn">最後</a></th
                    >
                    <th> <a class="btn">勝敗</a></th>
                    <th colspan="2">
                      <a class="btn">陣営</a>
                      <a class="btn">役割</a></th
                    >
                    <th><a class="btn">希望</a></th>
                    <th><a class="btn">補足</a></th>
                    <th class="last" />
                  </tr>
                </tfoot>
                <tbody class="potofs fine tlist">
                  <tr>
                    <td class="c mdi" />
                    <th class="r leave">肉屋</th>
                    <th class="l leave">ニール</th>
                    <td class="r leave" />
                    <td class="c leave">―</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r leave">食いしん坊</th>
                    <th class="l leave">マリアンヌ</th>
                    <td class="r leave" />
                    <td class="c leave">―</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r victim">厭世家</th>
                    <th class="l victim">サイモン</th>
                    <td class="r victim"> 2日</td>
                    <td class="c victim">襲撃</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r executed">聖歌隊員</th>
                    <th class="l executed">レティーシャ</th>
                    <td class="r executed"> 3日</td>
                    <td class="c executed">処刑</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r victim">靴磨き</th>
                    <th class="l victim">トニー</th>
                    <td class="r victim"> 3日</td>
                    <td class="c victim">襲撃</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r victim">奏者</th>
                    <th class="l victim">ビリー</th>
                    <td class="r victim"> 4日</td>
                    <td class="c victim">襲撃</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r executed">店番</th>
                    <th class="l executed">ソフィア</th>
                    <td class="r executed"> 4日</td>
                    <td class="c executed">処刑</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r executed">漂白工</th>
                    <th class="l executed">ピッパ</th>
                    <td class="r executed"> 5日</td>
                    <td class="c executed">処刑</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r victim">牧人</th>
                    <th class="l victim">リンダ</th>
                    <td class="r victim"> 5日</td>
                    <td class="c victim">襲撃</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r victim">流浪者</th>
                    <th class="l victim">ペラジー</th>
                    <td class="r victim"> 6日</td>
                    <td class="c victim">襲撃</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r executed">若者</th>
                    <th class="l executed">テッド</th>
                    <td class="r executed"> 6日</td>
                    <td class="c executed">処刑</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r live">子守り</th>
                    <th class="l live">パティ</th>
                    <td class="r live" />
                    <td class="c live">生存者</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                  <tr>
                    <td class="c mdi" />
                    <th class="r live">小娘</th>
                    <th class="l live">ゾーイ</th>
                    <td class="r live" />
                    <td class="c live">生存者</td>
                    <td class="l"><del>...</del></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {/if}
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
  .inframe {
    padding: 0;
  }
}

.icons {
  width: 14px;
  margin: 0 3px 10px auto;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  align-content: space-around;
  justify-content: space-around;

  :global(.item-half),
  :global(.item) {
    box-sizing: content-box;
    flex-basis: auto;
    text-align: center;
    border-radius: 5px;
    margin: 2px 0;
    font-size: 20px;
    width: 20px;
  }

  :global(.item-half) {
    height: 30px;
  }
  :global(.item) {
    height: 60px;
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
  right: 0;
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
.inframe,
.outframe,
.fullframe,
.contentframe {
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

.summaryframe,
.toastframe,
.sideframe,
.writeframe,
.center-left,
.center-right {
  pointer-events: none;
}

.editframe,
.inframe {
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
