<script lang="ts">
import { oldlogs, oldlogs_stories } from '$lib/pubsub/poll'
import { Post, Report } from '$lib/chat'
import { Focus } from '$lib/scroll'
import OldlogsGroup from '$lib/pubsub/ui/oldlogs-group.svelte'
import Poll from '$lib/storage/Poll.svelte'
import Grid from '$lib/inline/Grid.svelte'
import Sup from '$lib/inline/Sup.svelte'
import site from '$lib/site'
import uri from '$lib/uri'

const page = uri.hash()

const { url } = site

let search = ''
let asc = 'desc'
let order = ''
let drill = false

let folder_id = []
let monthry = []
let upd_range = []
let upd_at = []
let sow_auth_id = []
let rating = []
let size = []
let say = []
let game = []
let option = []
let event = []
let discard = []
let config = []

$: g = $oldlogs_stories.group
$: b = $oldlogs_stories.base

function entrySearch() {
  order = 'name'
  drill = false
}

function rating_img(rating: string) {
  return `${$url.store}/images/icon/cd_${rating}.png`
}
</script>

<Post handle="btns">
  <OldlogsGroup bind:value={order} />
  <input type="text" bind:value={order} on:focus={entrySearch} />
  <sub style="width: 100%">{$oldlogs_stories.list.length}村があてはまります。</sub>
</Post>

<Report handle="btns">
  {#if drill}
    {#if order === 'vid'}
      <p>
        {#each g.folder_id as o (o._id)}
          <Btn bind:value={folder_id} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'write_at'}
      <p class="swipe">
        <Grid
          x={g.in_month}
          y={g.yeary}
          data={b.monthry}
          bind:value={monthry}
          find={(xid, yid) => `${yid}${xid}`} />
      </p>
    {/if}

    {#if order === 'upd_range'}
      <p>
        {#each g.upd_range as o (o._id)}
          <Btn bind:value={upd_range} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'upd_at'}
      <p>
        {#each g.upd_at as o (o._id)}
          <Btn bind:value={upd_at} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'sow_auth_id'}
      <p>
        {#each g.sow_auth_id as o (o._id)}
          <Btn bind:value={sow_auth_id} as={[o._id]}
            >{o._id.replace(/\&\#2e/gi, '.')}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'rating'}
      <p>
        {#each g.rating as o (o._id)}
          <Btn bind:value={rating} as={[o._id]}>{rating_img(o._id)}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'vpl.0'}
      <p>
        {#each g.size as o (o._id)}
          <Btn bind:value={size} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'card.option'}
      <p>
        {#each g.option as o (o._id)}
          <Btn bind:value={option} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'card.event'}
      <p>
        {#each g.event as o (o._id)}
          <Btn bind:value={event} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'card.config'}
      <p>
        {#each g.config as o (o._id)}
          <Btn bind:value={config} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'card.discard'}
      <p>
        {#each g.discard as o (o._id)}
          <Btn bind:value={discard} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'say.label'}
      <p>
        {#each g.say as o (o._id)}
          <Btn bind:value={say} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}

    {#if order === 'game.label'}
      <p>
        {#each g.game as o (o._id)}
          <Btn bind:value={game} as={[o._id]}>{o._id}<Sup value={o.count} /></Btn>
        {/each}
      </p>
    {/if}
  {/if}
</Report>

{#each $oldlogs_stories.list as o (o._id)}
  <Focus id={o._id} bind:value={$page}>
    <Report handle="MAKER">
      <p class="name">
        <sup class="pull-right">{o.sow_auth_id}</sup>
        <a href="/sow/show?book_id={o._id}&top&full">{o.name}</a>
      </p>
      <div class="cards">
        <table class="btns card" style="width: 33%">
          <tbody>
            <tr>
              <th
                ><kbd style="width: 40px"><img class="mark" src={rating_img(o.rating)} /></kbd></th>
              <td>{o._id}</td>
            </tr>
            <tr>
              <th>更新</th>
              <td>{o.upd_range}毎 {o.upd_at}</td>
            </tr>
            <tr>
              <th>規模</th>
              <td>{o.size}人 {o.say}</td>
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
            <a class="label {o.mob.win}" v-if="o.mob">{o.mob.label}</a>
            <a class="label" v-if="o.game">{o.game.label}</a>
            <template v-for="opt in o.option_datas.list">
              <wbr /><a class="label">{opt.label}</a>
            </template>
          </p>
          <p>
            <template v-if="role" v-for="role in o.roles.config">
              <wbr /><a class="label" :class="role.win">{role.label}<Sup value={role.count} /></a>
            </template>
          </p>
          <hr />
          <p>
            <template v-if="role" v-for="role in o.roles.event">
              <wbr /><a class="label" :class="role.win">{role.label}<Sup value={role.count} /></a>
            </template>
          </p>
          <p>
            <template v-if="role" v-for="role in o.roles.discard">
              <wbr /><a class="label" :class="role.win">{role.label}<Sup value={role.count} /></a>
            </template>
          </p>
        </div>
      </div>
    </Report>
  </Focus>
{/each}

<Report handle="footer" key="limitup">
  <scrollmine v-if="page_next_idx" on:input={() => 1} :as="page_next_idx">次頁</scrollmine>
</Report>

<Poll {...oldlogs()} />
