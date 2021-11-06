<script lang="ts">
import type { Tag } from '$lib/pubsub/map-reduce'

import { flip } from 'svelte/animate'
import { scale } from 'svelte/transition'
import { backOut } from 'svelte/easing'

import Portrate from '$lib/block/Portrate.svelte'
import Btn from '$lib/inline/Btn.svelte'

import { __BROWSER__ } from '$lib/browser/device'
import { Post, Report, Portrates } from '$lib/chat'
import * as uri from '$lib/uri'
import { Tags } from '$lib/pubsub/map-reduce'
import { faces_with_tag_and_job, face_size } from '$lib/pubsub/join/chr'

const tag_id = uri.hash<Tag['_id']>('giji')
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
                <Btn class="btn" as={o._id} bind:value={$tag_id}
                  >{o.label}<sup>{face_size(o._id)}</sup></Btn>
              {/if}
            {/each}
          </p>
        {/each}
      </fieldset>
    {/each}
  </div>
  <hr />
  <p class="form">
    <label for="search" class="mdi mdi-magnify" /><input
      id="search"
      size="30"
      list="search_log"
      class="search" /><datalist id="search_log" /><!---->
  </p>
  <sub style="width: 100%;">{Tags.find($tag_id)?.long}</sub>
</Report>

<Portrates>
  {#if false}
    {#each faces_with_tag_and_job($tag_id) as [o, tag, chr_job], idx (o._id)}
      <div>
        <Portrate face_id={o._id}>
          <p>{chr_job.job}</p>
          <p>{o.name}</p>
        </Portrate>
      </div>
    {/each}
  {:else}
    {#each faces_with_tag_and_job($tag_id) as [o, tag, chr_job], idx (o._id)}
      <div
        in:scale={$tag_id === 'all'
          ? { delay: 0, duration: 0, opacity: 0, start: 1 }
          : { delay: 0, duration: 600, opacity: 0, start: 0, easing: backOut }}
        animate:flip={{ delay: 0, duration: 600, easing: backOut }}>
        <Portrate face_id={o._id}>
          <p>{chr_job.job}</p>
          <p>{o.name}</p>
        </Portrate>
      </div>
    {/each}
  {/if}
</Portrates>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>
