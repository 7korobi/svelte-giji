<script lang="ts">
import { oldlogs, oldlogs_stories } from '$lib/pubsub/poll'
import { Report } from '$lib/chat'
import { Focus } from '$lib/scroll'
import OldlogFinder from '$lib/site/OldlogFinder.svelte'
import Poll from '$lib/storage/Poll.svelte'
import Strong from '$lib/inline/Strong.svelte'
import site from '$lib/site'
import uri from '$lib/uri'

const page = uri.hash()

const { url } = site

let order = 'vid'

$: g = $oldlogs_stories.group
$: b = $oldlogs_stories.base
</script>

<OldlogFinder bind:order />

{#each $oldlogs_stories.list as o (o._id)}
  <Focus id={o._id} bind:value={$page}>
    <Report handle="TITLE">
      <p class="name">
        <sup class="pull-right">{o.sow_auth_id}</sup>
        <a href="/sow/show?book_id={o._id}&full">{@html o.name}</a>
      </p>
      <div class="cards">
        <table class="btns card" style="width: 33%">
          <tbody>
            <tr>
              <th
                ><kbd>
                  {#each o.marks as mark (mark._id)}
                    <img class="mark" alt="" src="{$url.icon}{mark.file}" />
                  {/each}
                </kbd></th
              >
              <td>{o._id}</td>
            </tr>
            <tr>
              <th>更新</th>
              <td>{o.upd_range}毎 {o.upd_at}</td>
            </tr>
            <tr>
              <th>規模</th>
              <td>{o.size}人 <wbr />{o.say_limit.label}</td>
            </tr>
            <tr>
              <td colspan="2">
                <timeago :since="o.write_at" />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="card" style="width: 66%">
          <p>
            {#if o.game}
              {o.game.label}
            {/if}
            {#if o.mob_role}
              <wbr /><span class="label {o.mob_role.win || 'btns'}">{o.mob_role.label}</span>
            {/if}
            {#each o.options as opt (opt.label)}
              <wbr /><span class="label btns">{opt.label}</span>
            {/each}
          </p>
          <p>
            {o.role_table.label}
            {#each o.configs as role (role._id)}
              <wbr /><span class="label {role.win || 'btns'}"
                >{role.label}<Strong min={1} value={role.count} /></span
              >
            {/each}
          </p>
          <hr />
          <p>
            事件
            {#each o.traps as role (role._id)}
              <wbr /><span class="label {role.win || 'btns'}"
                >{role.label}<Strong min={1} value={role.count} /></span
              >
            {/each}
          </p>
          <p>
            破棄
            {#each o.discards as role (role._id)}
              <wbr /><span class="label {role.win || 'btns'}"
                >{role.label}<Strong min={1} value={role.count} /></span
              >
            {/each}
          </p>
        </div>
      </div>
    </Report>
  </Focus>
{/each}

<Report handle="footer">
  <scrollmine v-if="page_next_idx" on:input={() => 1} as="page_next_idx">次頁</scrollmine>
</Report>

<Poll {...oldlogs()} />

<style lang="scss">
.cards {
  display: flex;
  flex: row;
}

img.mark {
  height: 2.5ex;
}
</style>
