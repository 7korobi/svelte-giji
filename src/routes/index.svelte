<script lang="ts">
import { FireNotify, FireOauth } from '$lib/fire'
import { Focus } from 'svelte-scroll-observe'
import { Time } from 'svelte-tick-timer'
import fire from '$lib/fire'
import { Location } from 'svelte-bind-uri'
import { new_plan, random_test } from '$lib/pubsub/extra/query'
import { story_reduce } from '$lib/pubsub/book/query'
import { Ables, Roles, SayLimits } from '$lib/pubsub/map-reduce'
import { Post, Talk, Report } from '$lib/site/chat'

const { user } = fire
let page = ''

// $: console.log($Roles)
// $: console.log($Ables)
// $: console.log($SayLimits)

new_plan
random_test
</script>

<svelte:head>
  <title>人狼議事</title>
</svelte:head>
<Location bind:hash={page} />

<Post handle="TSAY">
  <FireOauth />
  <p>ログイン中にできること。</p>
  <p>：過去ログビュアーでタップしたとき、栞を挟んで記録します。</p>
</Post>

<Focus id="lobby" bind:value={page}>
  {#if $user}
    <Report handle="footer center">ロビー</Report>
  {/if}

  <Talk face_id="t82" handle="SSAY">
    <p class="name">子ども食堂 サガタ</p>
    <hr />
    <p class="text">
      ほい、いらっしゃい！ <br /><br />
      うちは食堂だからね。どこからきたどんなお客にも、<a href="https://twitter.com/hello_giji"
        >手作りの温かいご飯</a
      >を食べてってもらうのさ。<br /><br />
      炊き出しはおかわりも自由だよ。まあちょっと座って、一食おあがりよ。
    </p></Talk
  >
</Focus>

<Focus id="info" bind:value={page}>
  <Report handle="footer center">みんなの情報</Report>

  <Post handle="SSAY">
    <p><a href="/rule-guide">人狼議事のルール</a></p>
    <p class="text">人狼議事を遊ぶとき、従うべきルールはこちら。</p>
  </Post>

  <Post handle="SSAY">
    <p><a href="/guideline">人狼議事二次利用のガイドライン</a></p>
    <p class="text">人狼議事の思い出で、もっと遊ぶときのガイドラインはこちら。</p>
  </Post>
</Focus>

<Focus id="chr" bind:value={page}>
  <Post handle="SSAY">
    <p>
      <a href="/chr/list">キャラクター一覧</a>
      <a href="/chr/npc">最初の犠牲者一覧</a>
    </p>
    <p class="text">人狼議事を遊ぶ参考にどうぞ。</p>
  </Post>
</Focus>

<Focus id="oldlog" bind:value={page}>
  <Post handle="GSAY">
    <p>進行中形式のままの過去ログ</p>
    <hr />
    <p class="text">
      過去ログビューアとはまた違った読み味の、進行中のスタイルそのままの過去ログを、一部分ですが用意しました。
    </p>
    &nbsp;
    <a href="http://dais.kokage.cc/giji-log/cafe/sow.cgi?cmd=oldlog">cafe</a>
    &nbsp;
    <a href="http://dais.kokage.cc/giji-log/crazy/sow.cgi?cmd=oldlog">crazy</a>
    &nbsp;
    <a href="http://dais.kokage.cc/giji-log/morphe/sow.cgi?cmd=oldlog">morphe</a>
  </Post>
</Focus>

<Focus id="summary" bind:value={page}>
  <Post handle="PSAY">
    <p>
      <a href="/summary/chr/list">キャラクター活躍記録</a>
    </p>
    <p class="text">どこかの村で活躍したことのあるキャラクターはこちら。</p>
  </Post>

  <Post handle="PSAY">
    <p>
      <a href="https://waoon.net/record/">人狼戦績まとめ</a>
    </p>
    <p class="text">あのとき同村したあの人のことが知りたい、というときはこちら。</p>
  </Post>
</Focus>

<Focus id="history" bind:value={page}>
  <Report handle="footer center">おまけの情報</Report>

  <Post handle="SSAY">
    <p>更新履歴</p>
    <hr />
    &nbsp;
    <a href="https://github.com/7korobi/giji-fire/commits/master">総合トップ</a>
    &nbsp;
    <a href="https://github.com/7korobi/giji_assets/commits/chr-add">キャラ更新</a>
    &nbsp;
    <a href="https://github.com/7korobi/giji-sow-api/commits/master">村ログAPI</a>
    &nbsp;
    <a href="https://github.com/7korobi/giji_rails/commits/master">村ログ収集</a>
    &nbsp;
    <a href="https://github.com/7korobi/sow-giji/commits/cabala">人狼</a>
    &nbsp;
    <a href="https://github.com/7korobi/sow-giji/commits/show-fix">人狼(ciel)</a>
  </Post>
</Focus>

<Focus id="testsite" bind:value={page}>
  <Post handle="VGSAY">
    <p>
      <a href="https://gijilog.web.app">テストサイト</a>
    </p>
    <p class="text">つくりかけの人狼議事総合トップが置いてあります。</p>
  </Post>
</Focus>

<Focus id="creation" bind:value={page}>
  <Post handle="VGSAY">
    &nbsp;
    <a href="https://naming-dic.com/about.html">ネーミング辞典</a>
    &nbsp;
    <a href="https://myth.maji.asia">紳魔精妖名辞典</a>
    &nbsp;
    <a href="http://naming.nobody.jp/">創作支援名前倉庫</a>
    &nbsp;
    <a href="https://ichiranya.com/">いちらん屋</a>
    <p>創作のお供にどうぞ。</p>
  </Post>
</Focus>

<Focus id="sleeping" bind:value={page}>
  <Talk face_id="sf04" handle="GSAY">
    <p class="name">お散歩隊長 アシモフ</p>
    <hr />
    <p class="text">
      居眠りを思わせる安らいだ表情で、白鼠が小さく丸まり、<a href="https://twitter.com/jinrogiji"
        ><ruby>凍り付いている<rt>freeze</rt></ruby></a
      >…。
    </p></Talk
  >
</Focus>

<Focus id="fcm-head" bind:value={page}>
  <Report handle="footer">
    <h3 class="text center ">企画村予定／開始待ちの村／進行中の村</h3>
    <hr />
    <p>
      <FireNotify topic="news">新しい村について通知を受ける。</FireNotify>
    </p>
    <p>※ 下の通知ボタンでは、こういった通知を受けます。</p>
    <ul>
      <li>全員コミットによる更新の一時間くらい前</li>
      <li>日程更新の一時間くらい前</li>
      <li>更新後</li>
      <li>新しい参加者</li>
    </ul>
  </Report>
</Focus>

{#each $story_reduce.progress?.list || [] as o (o._id)}
  <Focus id={o._id} bind:value={page}>
    <Post handle="SSAY">
      <p class="name">{o.name}</p>
      <hr />
      <p class="text">
        <FireNotify topic={o._id} />
        <a href={o.folder.top_url}>{o.folder.nation}{o.vid}</a> は、進行中だ。
      </p>
      <p class="date">
        {#if o.is_full_commit}
          コミット時刻 <Time at={o.timer.nextcommitdt} />
        {:else}
          更新時刻 <Time at={o.timer.nextupdatedt} />
        {/if}
      </p>
    </Post>
  </Focus>
{/each}

{#each $story_reduce.prologue?.list || [] as o (o._id)}
  <Focus id={o._id} bind:value={page}>
    <Post handle="LSAY">
      <p class="name">{o.name}</p>
      <hr />
      <p class="text">
        <FireNotify topic={o._id} />
        <a href={o.folder.top_url}>{o.folder.nation}{o.vid}</a> は、開始が楽しみだ。
      </p>
      <p class="date">
        廃村期限 <Time at={o.timer.scraplimitdt} />
      </p>
    </Post>
  </Focus>
{/each}

{#each $new_plan.list as o (o._id)}
  <Focus id={o._id.toString()} bind:value={page}>
    <Post handle="TSAY">
      <p class="name">
        <a href={o.link}>{o.name}</a>
      </p>
      <hr />
      <p class="text">
        {o.state || '（開催地不明）'}
      </p>
      <ul class="fine">
        {#each o.flavor as text}
          <li>{text}</li>
        {/each}
        {#each o.lock as text}
          <li class="VSSAY">{text}</li>
        {/each}
        {#each o.card as text}
          <li class="VSSAY">{text}</li>
        {/each}
      </ul>
      <p class="date">
        企画更新 <Time at={o.write_at} />
      </p>
    </Post>
  </Focus>
{/each}

<Focus id="demo" bind:value={page}>
  <Post handle="SSAY">
    <h1 class="text mono center">Welcome to SvelteKit</h1>
    <p class="text">Visit <a href="/demo">DEMO</a></p>
  </Post>
</Focus>

<style lang="scss">
</style>
