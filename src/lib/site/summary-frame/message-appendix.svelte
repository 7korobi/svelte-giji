<script lang="ts">
import type { BookEvent, BookMessage, BookPhase } from '$lib/pubsub/map-reduce'
import { clip } from '$lib/common'
import { Time } from '$lib/timer'

import Mention from '../inline/mention.svelte'
import { side, SideBits } from '../store'

export let page: number
export let phase: BookPhase
export let event: BookEvent
export let message: BookMessage

let widths = []
let sign = '???'

$: if (message) {
  sign = `???`
  if (message.potof?.sow_auth_id) sign = `by ${message.potof?.sow_auth_id}`
  if (message.sow_auth_id) sign = `by ${message.sow_auth_id}`
}
</script>

{#if message && event && $side & SideBits.posi.TimelineClock}
  <div class="message-detail fine {phase?.handle}" style={`width: ${Math.max(...widths)}px; }`}>
    <hr />
    <div class="flex">
      <p />
      <button title="クリップボードへコピー" on:click={clip}>
        <Mention id={message._id} let:mention>{mention}</Mention>
      </button>
      <p><b>{phase?.label}</b></p>
    </div>
    <div>
      <p class="left">
        <span bind:offsetWidth={widths[0]}>{sign}</span>
      </p>
      <p class="right">
        <span bind:offsetWidth={widths[1]}><Time at={message.write_at} limit="1日" /></span>
      </p>
    </div>
    <p style="white-space: nowrap;">
      <button title="クリップボードへコピー" on:click={clip} bind:offsetWidth={widths[2]}>
        <Mention id={message._id} base_id="" let:mention>
          (<b>&gt;&gt;</b>{mention}{message.face ? ` ${message.face.name}` : ''})
        </Mention>
      </button>
    </p>
  </div>
{/if}

<style lang="scss">
.message-detail {
  white-space: nowrap;
  transition-timing-function: ease-in-out;
  transition-duration: 250ms;
  transition-property: width;
}
.flex {
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  justify-content: space-between;
}
</style>
