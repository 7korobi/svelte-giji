<script lang="ts">
import type { Tag } from '$lib/pubsub/map-reduce'
import { flip } from 'svelte/animate'
import { scale } from 'svelte/transition'
import { backOut } from 'svelte/easing'
import { Location } from '$lib/uri'

import { Tags } from '$lib/pubsub/map-reduce'
import { faces_by_tag, tag_by_group } from '$lib/pubsub/chr/query'
import { __BROWSER__ } from '$lib/browser-device'

import { Btn, SearchText } from '$lib/design'
import { Post, Report, Portrates } from '$lib/site/chat'
import Portrate from '$lib/site/block/portrate.svelte'

let tag_id: Tag['_id'] = 'giji'
let search: RegExp
$: all = faces_by_tag[tag_id].chr_jobs
$: words = all.map((o) => `${o.job} ${o.face.name}`)
$: chr_jobs = search ? all.filter((o) => search.test(`${o.job} ${o.face.name}`)) : all
$: animate_scale =
  150 < chr_jobs.length
    ? { delay: 0, duration: 0, opacity: 0, start: 1 }
    : { delay: 0, duration: 600, opacity: 0, start: 0, easing: backOut }
</script>

<Location bind:hash={tag_id} />
<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<Report handle="header">
  <div class="center form">
    {#each tag_by_group as tagss, i}
      <fieldset>
        {#if tagss._id !== 'undefined'}
          <legend>{tagss._id}</legend>
        {/if}
        {#each tagss as tags, j}
          <p class="center">
            {#each tags.list as o, k}
              {#if o.faces?.length}
                <Btn class="btn" as={o._id} bind:value={tag_id}
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
    <SearchText bind:regexp={search} data={words} />
  </p>
  <sub style="width: 100%;">{Tags.find(tag_id)?.long}</sub>
</Report>

<Portrates>
  {#each chr_jobs as o, idx (o.face_id)}
    <div in:scale={animate_scale} animate:flip={{ delay: 0, duration: 600, easing: backOut }}>
      <Portrate face_id={o.face_id}>
        <p>{o.job}<br />{o.face.name}</p>
      </Portrate>
    </div>
  {/each}
</Portrates>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>
