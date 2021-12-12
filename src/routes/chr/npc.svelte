<script lang="ts">
import { ChrSet, ChrSets } from '$lib/pubsub/map-reduce'
import { Post, Report, Talk } from '$lib/chat'
import { Location } from '$lib/uri'

import Btn from '$lib/inline/Btn.svelte'
import SearchText from '$lib/inline/SearchText.svelte'
import { fade } from 'svelte/transition'
import { chr_sets_by_label } from '$lib/pubsub/chr/query'

let chr_set_id: ChrSet['_id'] = 'ririnra'
let search: RegExp
</script>

<Location bind:hash={chr_set_id} />
<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<Report handle="header">
  <div class="center form">
    {#each chr_sets_by_label as chr_sets, i}
      <fieldset>
        {#if i === 1}
          <legend>エキスパンション・セット</legend>
        {/if}
        <p class="center">
          {#each chr_sets as o, j}
            <Btn class="btn" as={o._id} bind:value={chr_set_id}
              >{o.label}<sup>{o.npcs.length}</sup></Btn
            >
          {/each}
        </p>
      </fieldset>
    {/each}
  </div>
  <hr />
  <p class="form">
    <SearchText bind:regexp={search} />
  </p>
  <p class="form">
    {ChrSets.find(chr_set_id).npcs[0].label}で選択できる、最初の犠牲者を表示しています。
  </p>
</Report>

{#each ChrSets.find(chr_set_id).npcs as npc, i (npc._id)}
  <div in:fade={{ delay: 0, duration: 600 }}>
    <Report handle="public">{npc.label}</Report>
    {#each npc.intro as intro, j (j)}
      {#if j}
        <Report handle="TITLE">{npc.chr_job.head} {'０１２'[j]}日目</Report>
      {:else}
        <Report handle="MAKER">{npc.chr_job.head} プロローグ</Report>
      {/if}
      <Talk handle="SSAY" face_id={npc.face_id}>
        <p class="name">{npc.chr_job.head}</p>
        <hr />
        <p class="text">{@html intro}</p>
        <p class="date">
          <abbr class="btn">{j}:0</abbr>
        </p>
      </Talk>
      {#if j === 1}
        <Post handle="WSAY">{npc.face.name}に牙を向けた。</Post>
      {/if}
    {/each}
    <br />
  </div>
{/each}

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>
