<script lang="ts">
import Poll from '$lib/storage/Poll.svelte'
import { oldlogs } from '$lib/pubsub/poll'
import Post from '$lib/chat/Post.svelte';
import Report from '$lib/chat/Report.svelte';
</script>

<Post handle="footer" key="breadcrumb">
  <bread-crumb />
</Post>
<Post class="form" handle="btns" key="form"
  ><span> <btn as="" @input="reset()" value="order"><i class="mdi mdi-eraser" /></btn></span><span>
    <btn as="vid" v-model="order" @toggle="submenu"
      >州<sup v-if="folder_id.length">{folder_id.length}</sup></btn>
    <btn as="rating" v-model="order" @toggle="submenu"
      >こだわり<sup v-if="rating.length">{rating.length}</sup></btn
    ></span
  ><span>
    <btn as="timer.updateddt" v-model="order" @toggle="submenu"
      >年月日<sup v-if="monthry.length">{monthry.length}</sup></btn>
    <btn as="upd_range" v-model="order" @toggle="submenu"
      >更新間隔<sup v-if="upd_range.length">{upd_range.length}</sup></btn>
    <btn as="upd_at" v-model="order" @toggle="submenu"
      >更新時刻<sup v-if="upd_at.length">{upd_at.length}</sup></btn
    ></span
  ><span>
    <btn as="vpl.0" v-model="order" @toggle="submenu"
      >人数<sup v-if="size.length">{size.length}</sup></btn>
    <btn as="say.label" v-model="order" @toggle="submenu"
      >発言ルール<sup v-if="say.length">{say.length}</sup></btn>
    <btn as="game.label" v-model="order" @toggle="submenu"
      >ゲーム<sup v-if="game.length">{game.length}</sup></btn
    ></span
  ><span>
    <btn as="sow_auth_id" v-model="order" @toggle="submenu"
      >村建て人<sup v-if="sow_auth_id.length">{sow_auth_id.length}</sup></btn
    ></span
  ><span>
    <btn as="card.option" v-model="order" @toggle="submenu"
      >村設定<sup v-if="option.length">{option.length}</sup></btn>
    <btn as="card.config" v-model="order" @toggle="submenu"
      >参加役職<sup v-if="config.length">{config.length}</sup></btn
    ></span
  ><span>
    <btn as="card.event" v-model="order" @toggle="submenu"
      >破棄事件<sup v-if="event.length">{event.length}</sup></btn>
    <btn as="card.discard" v-model="order" @toggle="submenu"
      >破棄役職<sup v-if="discard.length">{discard.length}</sup></btn
    ></span>
  <search v-model="search" @focus="order = 'name'" /><sub style="width: 100%"
    >{page_all_contents.all | currency}村があてはまります。</sub>
</Post>
<Report class="form" v-if="drill" handle="btns" key="subform">
  <p v-if="order === 'vid'">
    <check v-for="o in summary('folder_id')" v-model="folder_id" :as="o.id" :key="o.id"
      >{o.id}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p class="swipe" v-if="order === 'timer.updateddt'">
    <grid v-bind="grid_data" v-model="monthry" />
  </p>
  <p v-if="order === 'upd_range'">
    <check v-for="o in summary('upd_range')" v-model="upd_range" :as="o.id" :key="o.id"
      >{o.id}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p v-if="order === 'upd_at'">
    <check v-for="o in summary('upd_at')" v-model="upd_at" :as="o.id" :key="o.id"
      >{o.id}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p v-if="order === 'sow_auth_id'">
    <check v-for="o in summary('sow_auth_id')" v-model="sow_auth_id" :as="o.id" :key="o.id"
      >{o.id.replace(/\&\#2e/gi, '.')}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p v-if="order === 'rating'">
    <check v-for="o in summary('rating')" v-model="rating" :as="o.id" :key="o.id"
      ><img class="mark" :src="rating_img(o.id)" /><sup v-if="1 &lt; o.count">{o.count}</sup
      ></check>
  </p>
  <p v-if="order === 'vpl.0'">
    <check v-for="o in summary('size')" v-model="size" :as="o.id" :key="o.id"
      >{o.id}人<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p v-if="order === 'card.option'">
    <check v-for="o in summary('option')" v-model="option" :as="o.id" :key="o.id"
      >{o.label}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p v-if="order === 'card.event'">
    <check v-for="o in summary('event')" v-model="event" :as="o.id" :key="o.id"
      >{o.label}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p v-if="order === 'card.config'">
    <check v-for="o in summary('config')" v-model="config" :as="o.id" :key="o.id"
      >{o.label}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p v-if="order === 'card.discard'">
    <check v-for="o in summary('discard')" v-model="discard" :as="o.id" :key="o.id"
      >{o.label}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p v-if="order === 'say.label'">
    <check v-for="o in summary('say')" v-model="say" :as="o.id" :key="o.id"
      >{o.label}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
  <p v-if="order === 'game.label'">
    <check v-for="o in summary('game')" v-model="game" :as="o.id" :key="o.id"
      >{o.label}<sup v-if="1 &lt; o.count">{o.count}</sup></check>
  </p>
</Report>
<div v-for="(villages, idx) in page_contents" :key="idx">
  <Report handle="MAKER" v-for="o in villages" :id="o._id" :key="o._id" @focus="focus">
    <div class="name">
      <sup class="pull-right">{o.sow_auth_id | decode}</sup>
      <nuxt-link :to="book_url(o.id, 'top', 'full')">{o.name}</nuxt-link>
    </div>
    <div class="cards">
      <table class="btns card" style="width: 33%">
        <tbody>
          <tr>
            <th
              ><kbd style="width: 40px"><img class="mark" :src="rating_img(o.q.rating)" /></kbd
              ></th>
            <td>{o.id}</td>
          </tr>
          <tr>
            <th>更新</th>
            <td>{o.q.upd_range}毎 {o.q.upd_at}</td>
          </tr>
          <tr>
            <th>規模</th>
            <td>{o.q.size}人 {o.say.label}</td>
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
          <a class="label" v-if="o.mob" :class="o.mob.win">{o.mob.label}</a><a
            class="label"
            v-if="o.game">{o.game.label}</a>
          <template v-for="opt in o.option_datas.list">
            <wbr /><a class="label">{opt.label}</a>
          </template>
        </p>
        <p>
          <template v-if="role" v-for="role in o.roles.config">
            <wbr /><a class="label" :class="role.win"
              >{role.label}<sup v-if="1 &lt; role.count">{role.count}</sup></a>
          </template>
        </p>
        <hr />
        <p>
          <template v-if="role" v-for="role in o.roles.event">
            <wbr /><a class="label" :class="role.win"
              >{role.label}<sup v-if="1 &lt; role.count">{role.count}</sup></a>
          </template>
        </p>
        <p>
          <template v-if="role" v-for="role in o.roles.discard">
            <wbr /><a class="label" :class="role.win"
              >{role.label}<sup v-if="1 &lt; role.count">{role.count}</sup></a>
          </template>
        </p>
      </div>
    </div>
  </Report>
</div>
<div>
  <Report handle="footer" key="limitup">
    <scroll-mine v-if="page_next_idx" @input="page_add" :as="page_next_idx">次頁</scroll-mine>
  </Report>
  <Post handle="footer">
    <bread-crumb />
  </Post>
</div>
<Poll {...oldlogs()} />
