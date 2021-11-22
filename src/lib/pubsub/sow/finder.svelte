<script lang="ts">
import { oldlogs_stories } from '$lib/pubsub/poll'
import { Erase } from '$lib/icon'
import Sup from '$lib/inline/Sup.svelte'
import Btn from '$lib/inline/Btn.svelte'

export let value: string
export let drill = false

$: g = $oldlogs_stories.group

function reset() {
  value = ''
  //	@$router.replace query: { @order }
}

function submenu() {
  drill = !drill
}
</script>

<span>
  <button on:click={reset}><Erase /></button>
</span><span>
  <Btn as="vid" bind:value onToggle={submenu}>州<Sup value={g.folder_id.length} /></Btn>
  <Btn as="rating" bind:value onToggle={submenu}>こだわり<Sup value={g.mark.length} /></Btn>
</span><span>
  <Btn as="write_at" bind:value onToggle={submenu}>年月日<Sup value={g.monthry.length} /></Btn>
  <Btn as="upd_range" bind:value onToggle={submenu}>更新間隔<Sup value={g.upd_range.length} /></Btn>
  <Btn as="upd_at" bind:value onToggle={submenu}>更新時刻<Sup value={g.upd_at.length} /></Btn>
</span><span>
  <Btn as="vpl.0" bind:value onToggle={submenu}>人数<Sup value={g.size.length} /></Btn>
  <Btn as="say.label" bind:value onToggle={submenu}
    >発言ルール<Sup value={g.say_limit.length} /></Btn
  >
  <Btn as="game.label" bind:value onToggle={submenu}>ゲーム<Sup value={g.game.length} /></Btn>
</span><span>
  <Btn as="sow_auth_id" bind:value onToggle={submenu}
    >村建て人<Sup value={g.sow_auth_id.length} /></Btn
  >
</span><span>
  <Btn as="card.option" bind:value onToggle={submenu}>村設定<Sup value={g.option.length} /></Btn>
  <Btn as="card.config" bind:value onToggle={submenu}>参加役職<Sup value={g.config.length} /></Btn>
</span><span>
  <Btn as="card.event" bind:value onToggle={submenu}>破棄事件<Sup value={g.event.length} /></Btn>
  <Btn as="card.discard" bind:value onToggle={submenu}>破棄役職<Sup value={g.discard.length} /></Btn
  >
</span>
