<script lang="ts">
import type { FaceID } from '$lib/pubsub/_type/id'

import { Location } from 'svelte-bind-uri'
import { Time } from 'svelte-tick-timer'
import { Faces, Phases } from '$lib/pubsub/map-reduce'
import { by_face } from '$lib/pubsub/chr_face/query'
import { Post, Report, Talk } from '$lib/site/chat'
import { Btn, Strong } from '$lib/design'
import { currency } from 'replace-characters'

const folder_handle = {
  offparty: 'FSAY',
  lobby: 'FSAY',
  test: 'FSAY',
  pan: 'FSAY',

  wolf: 'PSAY',
  allstar: 'PSAY',
  ultimate: 'PSAY',

  cabala: 'SSAY',
  morphe: 'SSAY',

  rp: 'VSSAY',
  pretense: 'VSSAY',
  soybean: 'VSSAY',
  crazy: 'VSSAY',
  perjury: 'VSSAY',
  xebec: 'VSSAY',
  ciel: 'VSSAY',
  dais: 'VSSAY'
}

let params: {
  face_id: FaceID
  order: 'story_ids.length' | 'count' | 'all' | 'date_min' | 'date_max'
} = {
  face_id: '',
  order: 'all'
}
$: ({ face_id } = params)
$: face = Faces.find(face_id)
$: ({ message, message_mestype, message_sow_auth, potof, potof_role, potof_live } = by_face(
  face_id
))
$: message_sow_auth.sort(params.order)
$: face_message = $message.list[0]
</script>

<Location bind:searchParams={params} />

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
  <p class="text">
    <a href="/summary/chr/list">キャラクター活躍記録</a>
  </p>
</Post>

{#if face_message?.story_ids.length}
  <Report handle="center footer">
    <h1>{face.name}の活躍</h1>
    <p class="center text">
      <Time limit="99年" at={face_message.date_min} /> ～ <Time
        limit="99年"
        at={face_message.date_max}
      />
    </p>
  </Report>

  <Talk handle="TSAY" face_id={face._id}>
    <p class="name">{face.name}</p>
    <hr />
    <p class="text">
      <b>{$potof_live.sum}</b>人が村にいました。
    </p>
    <div class="flex">
      {#each $potof_live.list as o}
        <span class="btn {o.live._id}">
          {o.live.label}<Strong min={0} value={o.story_ids.length} />
        </span>
      {/each}
    </div>
  </Talk>
  <Report handle="TSAY" face_id={face._id}>
    <p class="text">
      全部で<b>{$potof_role.list.length}</b>種類、のべ<b>{$potof_role.sum}</b>の能力を持ちました。
    </p>
    <div class="flex">
      {#each $potof_role.list as o}
        <span class="btn {o.role.win}">
          {o.role.label}<Strong min={0} value={o.story_ids.length} />
        </span>
      {/each}
    </div>
  </Report>

  <Report handle="footer">
    <article class="swipe">
      <table>
        <thead>
          <tr>
            <th>総合値</th>
            <th>一番長い発言</th>
            <th>総文字数</th>
            <th>総発言回数</th>
          </tr>
        </thead>
        <tbody class="calc">
          {#each $message_mestype.list as o}
            {@const phase = Phases.find(o._id.mestype)}
            <tr class={phase.handle}>
              <th>{phase.text}</th>
              <td>{currency(o.max)} 字</td>
              <td>{currency(o.all)} 字</td>
              <td>{currency(o.count)} 回</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </article>
  </Report>

  <Report handle="footer">
    <article class="swipe">
      <table>
        <thead>
          <tr>
            <th>平均値</th>
            <th>/村数</th>
            <th>文字数</th>
            <th>発言回数</th>
          </tr>
        </thead>
        <tbody class="calc">
          {#each $message_mestype.list as o}
            {@const phase = Phases.find(o._id.mestype)}
            <tr class={phase.handle}>
              <th>{phase.text}</th>
              <td>{currency(o.per)} 村</td>
              <td>{currency(o.all / o.per)} 字</td>
              <td>{currency(o.count / o.per)} 回</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </article>
  </Report>

  {#each $message.folder as folder (folder._id)}
    <Talk handle={folder_handle[folder._id]} {face_id}>
      <p class="name">{folder.nation}</p>
      <hr />
      {folder.length}回登場しました
      <p class="flex">
        {#each folder as id}
          <a href="/sow/show?idx={folder._id}-{id}-top&mode=normal">{id}</a>
        {/each}
      </p>
    </Talk>
  {/each}

  <Report handle="form center VGSAY">
    <p class="name">{face.name}で活躍した人達</p>
    <hr />
    <Btn as="story_ids_length" bind:value={params.order}>参加村数</Btn>
    <Btn as="count" bind:value={params.order}>総発言回数</Btn>
    <Btn as="all" bind:value={params.order}>総発言文字数</Btn>
    <Btn as="date_min" bind:value={params.order}>古参度</Btn>
    <Btn as="date_max" bind:value={params.order}>新着度</Btn>
    <article class="swipe">
      <table>
        {#each $message_sow_auth.list as o (o._id.sow_auth_id)}
          <tr>
            <td class="c"><abbr>{o._id.sow_auth_id}</abbr></td>
            <td class="r count">{currency(o.story_ids.length)}村</td>
            <td class="r count">{currency(o.count)}回</td>
            <td class="r count">{currency(o.all)}文字</td>
            <td class="c count">
              <Time limit="99年" at={o.date_min} />
            </td>
            <td class="c">
              <div class="gap">～</div>
            </td>
            <td class="c count">
              <Time limit="99年" at={o.date_max} />
            </td>
          </tr>
        {/each}
      </table>
    </article>
  </Report>

  <Post handle="footer">
    <p class="text">
      <a href="/">TOP</a>
    </p>
    <p class="text">
      <a href="/summary/chr/list">キャラクター活躍記録</a>
    </p>
  </Post>
{/if}

<style lang="scss">
.flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: flex-start;
  align-items: baseline;
  .btn,
  a {
    display: inline-block;
    text-align: right;
  }
}

.talk .flex a {
  min-width: calc(52ex / 14);
  width: calc(100% / 14);
}

.talk .flex .btn {
  min-width: 10ex;
  width: 20%;
}

.report .flex .btn {
  min-width: 12ex;
  width: 20%;
}

.calc td {
  text-align: right;
}
</style>
