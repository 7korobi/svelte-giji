<script lang="ts">
import { Post, Talk, Report } from '$lib/chat'
import { __BROWSER__ } from '$lib/browser/device'
import '../_app.svelte'
import uri from '$lib/uri'

const chat = uri.hash()
</script>

<svelte:head>
  <title>人狼議事のルール</title>
</svelte:head>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<Talk handle="MSAY" face_id="c143">
  <p>下記以外では、人狼議事内キャラチップの利用を許諾しておりません。</p>
</Talk>
<Report handle="footer">人狼議事公式サイト</Report>
<Post handle="MSAY">
  <p>
    議事総合トップ<br />
    人狼議事lobby<br />
    人狼議事morphe<br />
    人狼議事cafe<br />
    人狼議事perjury<br />
    人狼議事xebec<br />
    人狼議事crazy<br />
    人狼議事ciel
  </p>
</Post>
<Report handle="footer">人狼議事サポートサイト</Report>
<Post handle="MSAY">
  <p>
    SoyBean<br />
    Sangria<br />
    @7korobi<br />
    @hello_giji<br />
  </p>
</Post>
<Report handle="footer">二次創作での使い方ガイド</Report>
<Talk handle="MSAY" face_id="c96">
  <p>
    ここまでは、どのページの一番下にも同じことが記されていたね。ここから面白くなるので、居眠りは夜に先送りして聞いてほしい。<br
    /><br />
    人狼議事キャラクターを利用した二次創作。<br />
    これについて、私達が許諾し、共に楽しんでいきたいことは何か。ガイドラインはこのように纏まっている。<br
    />
  </p>
</Talk>
<Report handle="VSSAY">キャラクターについて</Report>
<Post handle="VSSAY">
  <p>村での演技にあわせて、システム肩書、名前と異なっていてもOK。</p>
</Post>
<Post handle="VSSAY">
  <p>スクリーンショットにキャラクター画像が含まれているのはOK。</p>
</Post>
<Post handle="VSSAY">
  <p>村の思い出を自分で描いたり、どなたかに描いてもらうのはOK。</p>
</Post>
<Post handle="VSSAY">
  <p>創作を人にお願いするときの条件やルールは、その人と相談してね。</p>
</Post>
<Report handle="VSSAY">グッズ制作について</Report>
<Post handle="VSSAY">
  <p>個人利用に限ってOK。</p>
</Post>
<Report handle="footer">ケーススタディ</Report>
<Talk handle="MSAY" face_id="c96">
  <p>
    ガイドラインに則って、いくつかの判断を例示します。ガイドラインを読んでもよくわからなかった人は、基準を察する参考にどうぞ。
  </p>
</Talk>
<Post handle="MSAY">
  <p>人狼議事内キャラチップへのリンク、画像配布、元画像加工はNG。</p>
</Post>
<Post handle="MSAY">
  <p>人狼議事内キャラチップのSNS利用、ブログ利用、画像切り取りを意図したスクリーンショットはNG。</p>
</Post>
<Post handle="MSAY">
  <p>人狼議事内キャラチップの印刷はNG。</p>
</Post>
<Post handle="MSAY">
  <p>人狼議事グッズを、ひろく頒布することはお控えいただき、すぐ下をご覧ください。</p>
</Post>
<Report handle="footer">ご相談はこちら</Report>
<Talk handle="MSAY" face_id="c143">
  <p>
    …以上となります。ご了承ください。<br />
    このガイドは今後も改善のため変更することや、非公開にすることがあるかもしれません。<br />
    判断に迷うとき、ここに明記されていないような新しいことをしたいときは、こちらへご相談ください。<br
    />
  </p>
  <hr />
  <p class="c">管理</p>
  <p class="c">
    <q class="btn">sol・la</q>
  </p>
  <p class="c">
    <a class="btn" href="mailto:7korobi@gmail.com" title="mailto:7korobi@gmail.com">ななころび</a>
  </p>
</Talk>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<style lang="scss">
p.text {
  white-space: pre-line;
}
</style>
