<script lang="ts">
import type { BookPotof } from '$lib/pubsub/map-reduce'
import { Btn } from '$lib/design'
import { side, SideBits } from '../store'
import type { DIC } from '$lib/map-reduce'

export let potofs = [] as BookPotof[]
export let order = 'date'

const orders = {
  date: (o) => o.cards[1].date,
  live: (o) => o.cards[1].role_id,
  give: (o) => o.cards[1].act.incite
} as DIC<(o: BookPotof) => any>
</script>

{#if $side & SideBits.posi.UsersOn}
  <div class="header">
    <div class="swipe">
      <table>
        <tfoot class="TITLE form tb-btn">
          <!-- svelte-ignore a11y-missing-attribute -->
          <tr>
            <th colspan="3"><sup>(スクロールします)</sup></th>
            <th><Btn bind:value={order} as="date">日程</Btn></th>
            <th><Btn bind:value={order} as="live">状態</Btn></th>
            <th><Btn bind:value={order} as="give">促</Btn></th>
            <th colspan="2">
              <Btn>回数</Btn>
              <Btn title="字数 ÷ 回数">平均</Btn>
              <Btn>字数</Btn>
              <Btn title="字数 ÷ 範囲">密度</Btn></th
            >
            <th>
              <Btn>最初</Btn>
              <Btn title="最後 － 最初">範囲</Btn>
              <Btn>最後</Btn></th
            >
            <th> <Btn>勝敗</Btn></th>
            <th colspan="2">
              <Btn>陣営</Btn>
              <Btn>役割</Btn></th
            >
            <th><Btn>希望</Btn></th>
            <th><Btn>補足</Btn></th>
            <th class="last" />
          </tr>
        </tfoot>
        <tbody class="potofs fine tlist">
          {#each potofs as potof}{/each}
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
{/if}
