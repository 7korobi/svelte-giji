<script lang="ts">
import type { BookStory } from '$lib/pubsub/map-reduce'
import { Pager } from 'svelte-scroll-observe'
import { default_stories_query } from '$lib/pubsub/model-client'
import { page } from '$app/stores'
import { Banner, Post, Report } from '$lib/site/chat'
import Mark from '$lib/site/inline/mark.svelte'
import { Strong } from '$lib/design'
import OldlogFinder from '$lib/site/chats/oldlog-finder.svelte'

let list: BookStory[] = []
let regexp = /^/g
let params = default_stories_query()
let hash = ''
let at_page: number
</script>

<svelte:head>
  <title>終了した村の一覧</title>
</svelte:head>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<OldlogFinder refresh={$page} bind:hash bind:regexp bind:params bind:list>
  <Pager
    chunk={10}
    bind:page={at_page}
    bind:focus={hash}
    bind:list
    id={(item) => item._id}
    base={(item) => item.event_id}
    let:item={o}
  >
    <Banner slot="page" let:page>{`p${page}`}</Banner>
    <Report handle="TITLE">
      <p class="name">
        <sup class="pull-right">{o.sow_auth_id}</sup>
        <a href="/sow/show?idx={o._id}-top&mode=full">{@html o.name}</a>
      </p>
      <div class="cards">
        <table class="btns card" style="width: 33%">
          <tbody>
            <tr>
              <th
                ><kbd>
                  <Mark ids={o.mark_ids} />
                </kbd></th
              >
              <td>{o._id}</td>
            </tr>
            <tr>
              <th>更新</th>
              <td>{o.upd_range}毎&thinsp;{o.upd_at}</td>
            </tr>
            <tr>
              <th>規模</th>
              <td>{o.say_limit.label}&thinsp;{o.size}人 </td>
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
  </Pager>
</OldlogFinder>

<Post handle="footer">
  <p class="text">
    <a href="/">TOP</a>
  </p>
</Post>

<style lang="scss">
.cards {
  display: flex;
  flex: row;
}
</style>
