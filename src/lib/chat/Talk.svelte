<script lang="ts">
import Portrate from '../block/Portrate.svelte'
import { deco } from './deco'

export let handle: string = 'VSSAY'
export let img_src: string = ''
export let face_id: string = 'undef'
</script>

<div class="talk">
  <div class="chat {handle}" use:deco>
    <slot />
  </div>
  <div class="baloon {handle}" />
  <Portrate {img_src} {face_id} />
</div>
