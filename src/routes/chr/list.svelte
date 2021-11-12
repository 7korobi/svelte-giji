<script lang="ts">
import type { Tag } from '$lib/pubsub/map-reduce'
import Portrate from '$lib/block/Portrate.svelte'
import Btn from '$lib/inline/Btn.svelte'
import { flip } from 'svelte/animate'
import { scale } from 'svelte/transition'
import { backOut } from 'svelte/easing'
import { Post, Report, Portrates } from '$lib/chat'

import { Tags } from '$lib/pubsub/map-reduce'
import { faces_by_tag, tag_by_group } from '$lib/pubsub/chr/query'
import { __BROWSER__ } from '$lib/browser/device'

import uri from '$lib/uri'

const tag_id = uri.hash<Tag['_id']>('giji')
</script>

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
                <Btn class="btn" as={o._id} bind:value={$tag_id}
                  >{o.label}<sup>{o.faces.length}</sup></Btn>
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
    {#each faces_by_tag[$tag_id].chr_jobs as o, idx (o.face_id)}
      <div>
        <Portrate face_id={o.face_id}>
          <p>{o.job}</p>
          <p>{o.face.name}</p>
        </Portrate>
      </div>
    {/each}
  {:else}
    {#each faces_by_tag[$tag_id].chr_jobs as o, idx (o.face_id)}
      <div
        in:scale={$tag_id === 'all'
          ? { delay: 0, duration: 0, opacity: 0, start: 1 }
          : { delay: 0, duration: 600, opacity: 0, start: 0, easing: backOut }}
        animate:flip={{ delay: 0, duration: 600, easing: backOut }}>
        <Portrate face_id={o.face_id}>
          <p>{o.job}</p>
          <p>{o.face.name}</p>
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
