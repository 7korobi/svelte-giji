<script lang="ts">
import type { ChrSet } from '$lib/pubsub/map-reduce'
import { Faces, ChrSets } from '$lib/pubsub/map-reduce'
import { Post, Report, Talk } from '$lib/chat'
import uri from '$lib/uri'
import Btn from '$lib/inline/Btn.svelte'
import { fade } from 'svelte/transition'
import { sets_with_npc, set_with_npc } from '$lib/pubsub/join/chr'

const chr_set_id = uri.hash<ChrSet['_id']>('ririnra')
</script>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<Report handle="header">
  <div class="center form">
    {#each ChrSets.data.by_label as chr_sets, i}
      <fieldset>
        {#if i === 1}
          <legend>エキスパンション・セット</legend>
        {/if}
        <p class="center">
          {#each sets_with_npc(chr_sets) as [o, npcs], j}
            <Btn class="btn" as={o._id} bind:value={$chr_set_id}
              >{o.label}<sup>{npcs.length}</sup></Btn>
          {/each}
        </p>
      </fieldset>
    {/each}
  </div>
  <hr />
  <p class="form">
    <label for="search" class="mdi mdi-magnify" /><input
      id="search"
      size="30"
      list="search_log"
      class="search" /><datalist id="search_log" />
  </p>
  <p class="form">
    {set_with_npc($chr_set_id)[1][0][0].label}で選択できる、最初の犠牲者を表示しています。
  </p>
</Report>

{#each set_with_npc($chr_set_id)[1] as [npc, head], i (npc._id)}
  <div in:fade={{ delay: 0, duration: 600 }}>
    <Report handle="public">{npc.label}</Report>
    {#each npc.intro as intro, j (j)}
      {#if j}
        <Report handle="TITLE">{head} {'０１２'[j]}日目</Report>
      {:else}
        <Report handle="MAKER">{head} プロローグ</Report>
      {/if}
      <Talk handle="SSAY" face_id={npc.face_id}>
        <p class="name">{head}</p>
        <hr />
        <p class="text">{@html intro}</p>
        <p class="date">
          <abbr class="btn">{j}:0</abbr>
        </p>
      </Talk>
      {#if j === 1}
        <Post handle="WSAY">{Faces.find(npc.face_id).name}に牙を向けた。</Post>
      {/if}
    {/each}
    <br />
  </div>
{/each}
