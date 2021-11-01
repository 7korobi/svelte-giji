<script lang="ts">
import type { Tag } from '../../pubsub/store/chr_tag'

import { flip } from 'svelte/animate'
import { scale } from 'svelte/transition'
import { backOut } from 'svelte/easing'

import Portrate from '$lib/block/Portrate.svelte'
import Btn from '$lib/inline/Btn.svelte'

import { __BROWSER__ } from '$lib/browser'
import { Post, Report } from '$lib/chat'
import { setHash } from '$lib/uri'
import { Tags } from '../../pubsub/store/chr_tag'
import { faces_with_tag_and_job, face_size } from '../../pubsub/join/chr';

let tag_id: Tag['_id'] = 'giji'
if (__BROWSER__) {
  tag_id = location.hash.slice(1) || 'giji'
}

$: setHash(tag_id)
</script>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<Report handle="header">
  <div class="center form">
    {#each Tags.data.group as tagss, i}
      <fieldset>
        {#if tagss._id !== 'undefined'}
          <legend>{tagss._id}</legend>
        {/if}
        {#each tagss as tags, j}
          <p class="center">
            {#each tags.list as o, k}
              {#if face_size(o._id)}
                <Btn class="btn" as={o._id} bind:value={tag_id}
                  >{o.label}<sup>{face_size(o._id)}</sup></Btn>
              {/if}
            {/each}
          </p>
        {/each}
      </fieldset>
    {/each}
  </div>
  <hr />
  <p class="form" />
  <p data-v-4dcf7e9c="" class="form">
    <label data-v-4dcf7e9c="" for="search" class="mdi mdi-magnify" /><input
      data-v-4dcf7e9c=""
      id="search"
      size="30"
      list="search_log"
      class="search" /><datalist data-v-4dcf7e9c="" id="search_log" /><!---->
  </p>
  <sub style="width: 100%;">{Tags.find(tag_id)?.long}</sub>
</Report>

<div class="fullframe">
  <div class="portrates">
    {#each faces_with_tag_and_job(tag_id) as [o, tag, chr_job], idx (o._id)}
      <div
        transition:scale={{ delay: 0, duration: 400, easing: backOut }}
        animate:flip={{ delay: 0, duration: 500, easing: backOut }}>
        <Portrate face_id={o._id}>
          <p>{chr_job.job}</p>
          <p>{o.name}</p>
        </Portrate>
      </div>
    {/each}
  </div>
</div>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>
