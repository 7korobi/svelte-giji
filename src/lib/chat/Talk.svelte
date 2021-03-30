<script lang="ts">
import Portrate from '../block/Portrate.svelte'

export let handle: string = 'VSSAY'
export let img_src: string = ''
export let face_id: string = 'undef'
</script>

<div class="talk">
  <div class="chat {handle}">
    <slot />
  </div>
  <div class="baloon {handle}" />
  <Portrate {img_src} {face_id} />
</div>
