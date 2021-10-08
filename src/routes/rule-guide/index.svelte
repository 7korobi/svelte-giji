<script lang="ts">
import { Post, Talk, Report, Banner } from '$lib/chat'
import { Focus } from '$lib/scroll'
import { __BROWSER__ } from '$lib/browser'
import { nation, village, maker, player } from '$lib/game/json/rule.json'
import '../_app.svelte'

let page = ''
let chat = ''
if (__BROWSER__) {
  page = chat = location.hash.slice(1)
}

$: setHistory(chat || page)

function setHistory(hash) {
  if (!__BROWSER__) return
  const url = new URL(location.href)
  url.hash = hash
  history.pushState({}, '', url)
}
</script>

<svelte:head>
  <title>人狼議事のルール</title>
</svelte:head>

<Post handle="footer">
  <p class="text mono">
    <a href="#nation">国のルール</a>
    <a href="#village">村のルール</a>
    <a href="#player">プレーヤー</a>
    <a href="#maker">村建て</a>
  </p>
</Post>
<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>
<Report handle="footer">準備はいいかな？</Report>
<Talk handle="MSAY" face_id="c96">
  <p class="name">学者 レオナルド</p>
  <hr />
  <p class="text">
    ようこそ。ここにはこのサイトを楽しむためのルールや心構えを綴ってある。
    暖炉のそばが開いているから、腰を下ろして熟読しよう。楽しいゲームは全員が対等で、全員が読んで理解しているルールがあって成り立つんだ。<br />
    ただし、やむを得ず、ルール違反をすることもあるだろうね。違反してしまった事実は覆らないけれど、ルールを破らざるをえなかった事情は、落ち着いて聞いてあげよう。
    <a chk="confirm" href="http://www.nihonjiten.com/data/763.html">罪を憎んで、人を憎まず</a>。
    これは話し合いをするゲームなんだ。<br /><br />

    <strong
      title={"法案や、企業の自主規制に従う必要はない。逆らう必要もない。\nそれよりもきみのそばの十数人のためを思おう。"}
      >このサイトは日本国の法律に従っている。</strong>
    特にここで、六法全書を引き写して退屈な思いをするつもりはないけれど、不正アクセス禁止法、個人情報保護法は関わりが深いはずだ。
  </p>
</Talk>

<Focus name="nation" bind:value={page}>
  <Report handle="MAKER">ルール</Report>
  <Report handle="footer">{nation.head}</Report>
  {#each nation.list as o, idx}
    <Focus name={`nation-${idx + 1}`} bind:value={chat}>
      <Report handle="VSSAY">
        <strong>{o.head}</strong>
        <hr />
        <p class="text">{@html o.log}</p>
      </Report>
    </Focus>
  {/each}
</Focus>

<Focus name="village" bind:value={page}>
  <Report handle="footer">{village.head}</Report>
  {#each village.list as o, idx}
    <Focus name={`village-${idx + 1}`} bind:value={chat}>
      <Report handle="SSAY">
        <strong>{o.head}</strong>
        <hr />
        <p class="text">{@html o.log}</p>
      </Report>
    </Focus>
  {/each}
</Focus>

<Focus name="violation" bind:value={page}>
  <Report handle="MAKER">ルール違反があったら？</Report>
  <Focus name="violation-1" bind:value={chat}>
    <Report handle="footer">はじめに</Report>
    <Talk handle="MSAY" face_id="c96">
      <p class="name">学者 レオナルド</p>
      <hr />
      <p class="text">
        もし、ルールに違反してしまったとしたら？とても残念なことだけれど、まだ絶望しなくていい。<br />
        きみには全員に釈明する、貴重な機会が残されているんだ。遊びに集まった皆が笑い合って解散するために、勇気を奮ってエピローグに顔を出してごらん。<br />
        真剣な話し合いが必要なときは、協力してそのための時間をなんとか捻り出してほしい。 家に帰るまでが遠足なのと同じで、エピローグが済むまでがその村なんだ。
      </p>
    </Talk>
    <Talk handle="MSAY" face_id="c96">
      <p class="name">学者 レオナルド</p>
      <hr />
      <p class="text">
        エピローグでは全員が一同に介し、墓下と地上にわかれることなく、勝つための嘘もなく、より率直な話ができる。
        この特性から、人狼議事ではエピローグでの話し合いを推奨しているよ。
        古い時代にサムライは、どのような事情にも沈黙して咎を一身に引き受けることを美徳としていたそうだ。
        起こったことを水に流すにはそれもいいだろうけれど、残念ながらみんなの気持ちはこのことに残ってしまうので、あまりよくない。<br />
        解散するときに心残りなく、さっぱりとお別れができるよう、エピローグを活用してほしい。もやもやと蟠りが残るのは、だめだね。
      </p>
    </Talk>
  </Focus>
  <Focus name="violation-2" bind:value={chat}>
    <Report handle="footer">突然死</Report>
    <Talk handle="GSAY" face_id="t07">
      <p class="name">勧善懲悪委 アカリ</p>
      <hr />
      <p class="text head">
        突然死は悪！そうですよね先生！<br />
        みんな一生懸命がんばっているのに、そんなことで汚されるの、悔しいです！
      </p>
    </Talk>
    <Talk handle="MSAY" face_id="c96">
      <p class="name">学者 レオナルド</p>
      <hr />
      <p class="text">
        正解、国のルールだね。 ただ、人狼議事では、１日間発言しない場合には２つの措置をとっている。<br />
        ひとつ、突然死とする措置。 ふたつ、ゲーム不参加扱いとする措置。<br />
        これらの罰則を超えて重大なことなのか、冷静に考えて行動しよう。また、事故的な、やむを得ない事情があるかもしれないよ。もし事情があれば、考慮して考えてみよう。
        僕らはここに遊びに来ているんだ。最後には笑い合って解散できることを目指そうね。
      </p>
    </Talk>
  </Focus>
  <Focus name="violation-3" bind:value={chat}>
    <Report handle="footer">どうすればいいの？</Report>
    <Talk handle="MSAY" face_id="c96">
      <p class="name">学者 レオナルド</p>
      <hr />
      <p class="text">
        ここでは、ルール違反についてとるべき対応を話そう。<br />
        さきの項目でアカリくんが嘆いていたように、真剣なゲームをしていれば、ルール違反を許したくないという強い情動もあるものなんだ。
        いっぽう、粗相があったらコップ一杯の日本酒を一気飲みして、ちょっといいところを見せればよい、という考え方もあるものだよ。<br />
        こうした考え方が村の中でずれていると、いざ何かがあったときに困ったり、不満が溜まったりしてしまう。
        開始前に、あなたの村ではどう対応する、という方針を明らかにしておくと、志向の合わない人と衝突してしまうことも減るはずだよ。
        どう対応するとよいのかを宿題にします、みなさんの良心にしたがって考えてみよう。
      </p>
    </Talk>
    <Talk handle="GSAY" face_id="g02">
      <p class="name">白鶴拳 志偉</p>
      <hr />
      <p class="text">
        うちの道場じゃ、気の抜けた奴は師範代が叩き出してるぜ！リアルがヤバそうだったり、難しくてわかんないなら控えとけよってことよ。<br />
        よーし、俺の建てる村は違反なんて許さん。アカリや†ルシフェル†みたいに、きちんと参加できるやつら誘ってガンガンいくのだあ！
      </p>
    </Talk>
    <Talk handle="GSAY" face_id="t01">
      <p class="name">友愛組合 チアキ</p>
      <hr />
      <p class="text">
        道場みたいな処だと窮屈だな。僕は自分で、別の村を建てるよ。僕の村は忙しい人もフォローするし、ルール違反（突然死とか）があっても、厳しく責め立てたくはないんだ。<br />
        …村に書いちゃうの勇気いるなあ。違反してもOKみたいに聞かれてしまいそうだ。ゴクリ。
        <strong>せっかく集まった仲間を責めたくないだけなんだけれど…どう伝えよう…</strong>
      </p>
    </Talk>
    <Talk handle="GSAY" face_id="c24">
      <p class="name">長老 ナタリア</p>
      <hr />
      <p class="text">
        あたしは難しいことを考えるのが苦手でねえ。あんまり上手に勝とうとできていなくても、厳しくしてほしくないねえ。<br />
        そうだわ、ヌマタロウさんをお誘いして、そういう村を建ててみようかしらねえ。お茶受けは拳骨煎餅かしらねえ。
      </p>
    </Talk>
  </Focus>
</Focus>
<Focus name="player" bind:value={page}>
  <Report handle="MAKER">心構え</Report>
  <Post handle="VSSAY">心構えを守って、楽しく、強く遊ぼう。</Post>
  <Report handle="footer">遊びにきたかたへ</Report>
  {#each player.list as o, idx}
    <Focus name={`player-${idx + 1}`} bind:value={chat}>
      <Report handle="MSAY">
        <strong>{o.head}</strong>
        <hr />
        <p class="text">{@html o.log}</p>
      </Report>
    </Focus>
  {/each}
</Focus>

<Focus name="maker" bind:value={page}>
  <Report handle="footer">{maker.head}</Report>
  <Talk handle="WSAY" face_id="t10">
    <p class="name">営利政府 トレイル</p>
    <hr />
    <p class="text">
      村建てフォームには、村のルールが既に記入してあります。
      賛同できる内容はそのまま残して、不足なら筆を加え、余分と判断する事項は削除して村を建ててください。<br />
      村を建てるとき気をつけると良いことを心構えに纏めました。 ぜひご覧ください。
    </p>
  </Talk>
  {#each maker.list as o, idx}
    <Focus name={`maker-${idx + 1}`} bind:value={chat}>
      <Report handle="VSSAY">
        <strong>{o.head}</strong>
        <hr />
        <p class="text">{@html o.log}</p>
      </Report>
    </Focus>
  {/each}
</Focus>

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
