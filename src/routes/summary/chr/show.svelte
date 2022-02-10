<script lang="ts">
import type { FaceID } from '$lib/pubsub/_type/id'
import { Faces } from '$lib/pubsub/map-reduce'
import { xxx } from '$lib/pubsub/chr_face/query'
import { Location } from '$lib/uri'
import { Post, Report, Talk } from '$lib/site/chat'
import { Strong } from '$lib/design'
import { Time } from '$lib/timer'

let params: {
  face_id: FaceID
} = {
  face_id: ''
}

$: face = Faces.find(params.face_id)

xxx([params.face_id])
</script>

<Location bind:searchParams={params} />

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
  <p class="text">
    <a href="summary/chr/list">キャラクター活躍記録</a>
  </p>
</Post>

{#if false && face.story_length}
  <Report handle="footer" deco="center">
    <h1>{face.name}の活躍</h1>
    <p class="text">
      <Time at={face.date_min} /> ～ <Time at={face.date_max} />
    </p>
  </Report>

  <Talk handle="TSAY" face_id={face.id}>
    <p class="name">{face.name}</p>
    <hr />
    <p class="text">
      <b>{face.lives.sum}</b>人が村にいました。
    </p>
    <div class="flex">
      {#each face.lives as o}
        <wbr /><span class="label3 {o._id.live}"
          >{o.role.label}<Strong min={0} value={o.story_ids.length} /></span
        >
      {/each}
      全部で<b>{face.roles.length}</b>種類、のべ<b>{face.roles.sum}</b>の能力を持ちました。
      {#each face.roles as o}
        <wbr /><span class="label3 {o.role.win}"
          >{o.role.label}<Strong min={0} value={o.story_ids.length} /></span
        >
      {/each}
    </div>
  </Talk>

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
          {#each face.mestypes as o}
            <tr class={o.handle}>
              <th>{o.title}</th>
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
          {#each face.mestypes as o}
            <tr class={o.handle}>
              <th>{o.title}</th>
              <td>{currency(o.per)} 村</td>
              <td>{currency(o.all / o.per)} 字</td>
              <td>{currency(o.count / o.per)} 回</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </article>
  </Report>

  {#each faces.folders as folder (folder[0][0])}
    <Talk class="form" handle={folder_handle(folder[0][0])} face_id={face.id}>
      <p class="name">{folder.nation}</p>
      <hr />
      {folder.length}回登場しました
      <p class="flex">
        {#each folder as id}
          <a href={book_url(id, 'normal')}>{id[1]}</a>
        {/each}
      </p>
    </Talk>
  {/each}

  <Report class="form" handle="VGSAY" deco="center">
    <p class="name">{face.name}で活躍した人達</p>
    <hr />
    <Btn as="story_ids.length" bind:value={order}>参加村数</Btn>
    <Btn as="count" bind:value={order}>総発言回数</Btn>
    <Btn as="all" bind:value={order}>総発言文字数</Btn>
    <Btn as="date_min" bind:value={order}>古参度</Btn>
    <Btn as="date_max" bind:value={order}>新着度</Btn>
    <article class="swipe">
      <table>
        {#each sow_auths as o (o._id.sow_auth_id)}
          <tr>
            <td class="c"><abbr>{o._id.sow_auth_id}</abbr></td>
            <td class="r count">{currency(o.story_ids.length)}村</td>
            <td class="r count">{currency(o.count)}回</td>
            <td class="r count">{currency(o.all)}文字</td>
            <td class="c count">
              <Time at={o.date_min} />
            </td>
            <td class="c">
              <div class="gap">～</div>
            </td>
            <td class="c count">
              <Time at={o.date_max} />
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
      <a href="summary/chr/list">キャラクター活躍記録</a>
    </p>
  </Post>
{/if}
