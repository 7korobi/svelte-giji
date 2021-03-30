<script lang="ts">
import { url } from '../config'

export let img_src: string = ''
export let face_id: string = ''
export let mode: 'hide' | 'external'

$: src = img_src || `${url.portrate}${face_id}.jpg`
$: if (img_src) mode = 'external'
</script>

<div class="portrate">
  <img alt="" class={mode} {src} />
  {#if $$slots.default}
    <div class="chrblank">
      <slot />
    </div>
  {/if}
</div>
