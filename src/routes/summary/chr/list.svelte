<script lang="ts">
import type { ChrJob, Tag } from '$lib/pubsub/map-reduce'
import type { FaceID } from '$lib/pubsub/_type/id'
import { DIC, sort } from '$lib/map-reduce'
import { flip } from 'svelte/animate'
import { scale } from 'svelte/transition'
import { backOut } from 'svelte/easing'
import { Location } from '$lib/uri'

import { Tags } from '$lib/pubsub/map-reduce'
import { faces_by_tag, tag_by_group } from '$lib/pubsub/chr/query'
import { __BROWSER__ } from '$lib/common'

import {
  message_for_face_all,
  potof_for_face_all,
  potof_for_face_sow_auth_max_all
} from '$lib/pubsub/poll'
import { Time } from '$lib/timer'
import { faces } from '$lib/pubsub/poll'
import Poll from '$lib/storage/poll.svelte'

import { Post, Report } from '$lib/site/chat'
import { Btn, SearchText } from '$lib/design'
import Portrates from '$lib/site/chat/portrates.svelte'
import Portrate from '$lib/site/block/portrate.svelte'

const orderFunc = {
  order: (a: ChrJob[]) => sort(a).asc((o) => o.face.order),
  story_length: (a: ChrJob[]) =>
    sort(a).desc((o) => $potof_for_face_all.by_face[o.face_id]?.story_ids.length ?? 0),
  fav_count: (a: ChrJob[]) =>
    sort(a).desc((o) => $potof_for_face_sow_auth_max_all.by_face[o.face_id]?.count ?? 0),
  date_max: (a: ChrJob[]) => sort(a).desc((o) => $potof_for_face_all.by_face[o.face_id]?.date_max),
  date_min: (a: ChrJob[]) => sort(a).asc((o) => $message_for_face_all.by_face[o.face_id]?.date_min)
}

let params: {
  order: keyof typeof orderFunc
  tag_id: Tag['_id']
  search: string
} = {
  order: 'order',
  tag_id: 'giji',
  search: ''
}
let search: RegExp
$: summaries = [$message_for_face_all, $potof_for_face_all, $potof_for_face_sow_auth_max_all]
$: all = faces_by_tag[params.tag_id].chr_jobs
$: words = all.map((o) => `${o.job} ${o.face.name}`)
$: chr_jobs = orderFunc[params.order](
  search ? all.filter((o) => search.test(`${o.job} ${o.face.name}`)) : all
)
$: animate_scale =
  150 < chr_jobs.length
    ? { delay: 0, duration: 0, opacity: 0, start: 1 }
    : { delay: 0, duration: 600, opacity: 0, start: 0, easing: backOut }

function show_summary(id: FaceID, targets: { by_face: DIC<any> }[]) {
  for (const target of targets) {
    if (!target.by_face[id]) return false
  }
  return true
}
</script>

<Location bind:searchParams={params} />
<Poll {...faces()} />

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<Post handle="SSAY">
  <ul>
    <li>人気度</li>
    <li><a>キャラクター名（詳細へリンク）</a></li>
    <li>♥ いちばん沢山、そのキャラクターで遊んだプレイヤー</li>
  </ul>
</Post>

<Report handle="header">
  <div class="center form">
    {#each tag_by_group as tagss}
      <fieldset>
        {#if tagss._id !== 'undefined'}
          <legend>{tagss._id}</legend>
        {/if}
        {#each tagss as tags}
          <p class="center">
            {#each tags.list as o}
              {#if o.faces?.length}
                <Btn class="btn" as={o._id} bind:value={params.tag_id}
                  >{o.label}<sup>{o.faces.length}</sup></Btn
                >
              {/if}
            {/each}
          </p>
        {/each}
      </fieldset>
    {/each}
  </div>
  <hr />
  <p class="form">
    <SearchText bind:value={params.search} bind:regexp={search} data={words} />
  </p>
  <sub style="width: 100%;">{Tags.find(params.tag_id)?.long}</sub>
</Report>
<Report handle="header">
  <p class="center">
    <Btn as="order" bind:value={params.order}>基本</Btn>
    <Btn as="story_length" bind:value={params.order}>登場回数</Btn>
    <Btn as="fav_count" bind:value={params.order}>偏愛度</Btn>
    <Btn as="date_max" bind:value={params.order}>新着度</Btn>
    <Btn as="date_min" bind:value={params.order}>古参度</Btn>
  </p>
</Report>
<Portrates>
  {#each chr_jobs as o (o.face_id)}
    <div in:scale={animate_scale} animate:flip={{ delay: 0, duration: 600, easing: backOut }}>
      <Portrate face_id={o.face_id}>
        {#if show_summary(o.face_id, summaries)}
          {#if 'fav_count' === params.order}
            <p>♥{$potof_for_face_sow_auth_max_all.by_face[o.face_id].count}回</p>
          {:else}
            <p>登場{$potof_for_face_all.by_face[o.face_id].story_ids.length}回</p>
          {/if}
          {#if 'date_max' === params.order}
            <p><Time format="yy-MM-dd" at={$potof_for_face_all.by_face[o.face_id].date_max} /></p>
          {/if}
          {#if 'date_min' === params.order}
            <p><Time format="yy-MM-dd" at={$message_for_face_all.by_face[o.face_id].date_min} /></p>
          {/if}
          <a href="/summary/chr/show?face_id={o.face_id}">
            <p>{o.job}<br />{o.face.name}</p>
          </a>
          <p>♥{$potof_for_face_sow_auth_max_all.by_face[o.face_id]._id.sow_auth_id}</p>
        {:else}
          {#if 'date_max' === params.order}
            <p>&nbsp;</p>
          {/if}
          {#if 'date_min' === params.order}
            <p>&nbsp;</p>
          {/if}
          <p>&nbsp;</p>
          <p>{o.job}<br />{o.face.name}</p>
          <p>&nbsp;</p>
        {/if}
      </Portrate>
    </div>
  {/each}
</Portrates>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<style lang="scss">
.xxx {
  position: sticky;
  top: 0px;
}
</style>
