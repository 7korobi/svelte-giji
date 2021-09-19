<script lang="ts">
import { __BROWSER__ } from '$lib/browser'
import { Post, Talk, Report } from '$lib/chat'
import FireOauth from '$lib/fire/FireOauth.svelte'
import { BreadCrumb } from '$lib/topic'
import { fire } from '$lib/store'

const { user } = fire

import './_app.svelte'
</script>

<svelte:head>
  <title>人狼議事</title>
</svelte:head>
<Post handle="TSAY">
  <FireOauth />
  <p>ログイン中にできること。</p>
  <p>：過去ログビュアーでタップしたとき、栞を挟んで記録します。</p>
</Post>

{#if $user}
  <Report handle="footer center">ロビー</Report>
{/if}

<Talk face_id="t82" handle="SSAY">
  <p class="name">子ども食堂 サガタ</p>
  <hr />
  <p class="text">
    ほい、いらっしゃい！ うちは食堂だからね。どこからきたどんなお客にも、<a
      href="https://twitter.com/hello_giji">手作りの温かいご飯</a
    >を食べてってもらうのさ。 炊き出しはおかわりも自由だよ。まあちょっと座って、一食おあがりよ。
  </p></Talk>

<Report handle="footer center">みんなの情報</Report>

<Post handle="SSAY">
  <p><a href="/rule-guide">人狼議事のルール</a></p>
  <p class="card">人狼議事を遊ぶとき、従うべきルールはこちら。</p>
</Post>

<Post handle="SSAY">
  <h1>Welcome to SvelteKit</h1>
  <p>Visit <a sveltekit:prefetch href="/demo">DEMO</a></p>
</Post>

<style lang="scss">
p.text {
  white-space: pre-line;
}
</style>
