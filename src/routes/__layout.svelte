<script lang="ts">
import { page } from '$app/stores'
import Browser, { PageTransition } from '$lib/browser'

import ThemeBtns from '$lib/inline/ThemeBtns.svelte'
import Report from '$lib/chat/Report.svelte'

/**
 * 携帯端末のセーフエリアを回避する比率。0.0 〜 1.0
 */
const SAFEAREA_RATIO = 1.0

function resize() {}

function scroll() {}
</script>

<div class="page-active-bg">
  <div class="page-active">
    <div class="outframe">
      <ThemeBtns />
      <div class="contentframe">
        <div class="inframe">
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
                class="limit1-ng tooltip-left">
                折返中
              </p>
            </div>
          </Report>
          <div class="icons form">
            <button
              class="btn item-half tooltip-left"
              data-tooltip="詳細情報を拡げる操作の ON / OFF">
              <i class="mdi mdi-arrow-expand-right" />
            </button>
            <button
              class="btn item-half tooltip-left active"
              data-tooltip="ページ一覧を一列にする / 折り返す">
              <i class="mdi mdi-gesture-swipe" />
            </button>
          </div>
        </div>
      </div>
      <div class="sideframe">
        <div class="inframe">
          <div class="icons form">
            <button
              class="btn item-half tooltip-left"
              data-tooltip="詳細情報を拡げる操作の ON / OFF">
              <i class="mdi mdi-arrow-expand-right" />
            </button>
            <button
              class="btn item-half tooltip-left active"
              data-tooltip="ページ一覧を一列にする / 折り返す">
              <i class="mdi mdi-gesture-swipe" />
            </button>
          </div>
        </div>
      </div>
      <div class="summaryframe impose">
        <div class="swipe">
          <table>
            <tfoot class="TITLE form tb-btn">
              <tr>
                <th colspan="3"><sup>(スクロールします)</sup></th>
                <th><a class="btn active">日程</a></th>
                <th><a class="btn">状態</a></th>
                <th><a class="btn">促</a></th>
                <th colspan="2">
                  <a class="btn">回数</a>
                  <a class="btn" title="字数 ÷ 回数">平均</a>
                  <a class="btn">字数</a>
                  <a class="btn" title="字数 ÷ 範囲">密度</a></th>
                <th>
                  <a class="btn">最初</a>
                  <a class="btn" title="最後 － 最初">範囲</a>
                  <a class="btn">最後</a></th>
                <th> <a class="btn">勝敗</a></th>
                <th colspan="2">
                  <a class="btn">陣営</a>
                  <a class="btn">役割</a></th>
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
      <div class="center-left" />
      <div class="center-right" />
    </div>
  </div>
</div>

<Browser ratio={SAFEAREA_RATIO} isDefaultSafeArea={true} />
