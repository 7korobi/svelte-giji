<script lang="ts">
import { Btn } from '$lib/design'
import * as site from '../store'

import Active from './export_active.svelte'

const { url, welcome_mode } = site
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="export form">
  <div class="welcome-btns cap">ロビー</div>
  <div class="welcome-btns cap">夢の形、陰謀</div>
  <div class="welcome-btns cap">ＲＰ</div>
  {#if $welcome_mode === 'progress'}
    <div class="welcome-links form tap">
      <p><a>lobby</a></p>
      <p><a>offparty</a></p>
    </div>
    <div class="welcome-links form">
      <p><a>wolf</a></p>
      <p><a>ultimate</a></p>
      <p><a>allstar</a></p>
      <p><a>morphe</a></p>
      <p><a>cafe</a></p>
    </div>
    <div class="welcome-links form">
      <p><a>role-play</a></p>
      <p><a>RP-advance</a></p>
      <p><a>crazy</a></p>
      <Active folder_idx="perjury" />
      <Active folder_idx="xebec" />
      <Active folder_idx="ciel" />
      <Active folder_idx="dais" />
    </div>
  {/if}
  {#if $welcome_mode === 'finish'}
    <div class="welcome-links form tap">
      <p><a href="/sow/village?folder_id=lobby" class="">lobby</a></p>
      <p><a href="/sow/village?folder_id=offparty" class="">offparty</a></p>
    </div>
    <div class="welcome-links form">
      <p><a href="/sow/village?folder_id=wolf" class="">wolf</a></p>
      <p><a href="/sow/village?folder_id=ultimate" class="">ultimate</a></p>
      <p><a href="/sow/village?folder_id=allstar" class="">allstar</a></p>
      <p><a href="/sow/village?folder_id=morphe" class="">morphe</a></p>
      <p><a href="/sow/village?folder_id=cabala" class="">cafe</a></p>
    </div>
    <div class="welcome-links form">
      <p><a href="/sow/village?folder_id=rp" class="">role-play</a></p>
      <p><a href="/sow/village?folder_id=pretense" class="">RP-advance</a></p>
      <p><a href="/sow/village?folder_id=crazy" class="">crazy</a></p>
      <p><a href="/sow/village?folder_id=perjury">perjury</a></p>
      <p><a href="/sow/village?folder_id=xebec" class="">xebec</a></p>
      <p><a href="/sow/village?folder_id=ciel" class="">ciel</a></p>
      <p><a href="/sow/village?folder_id=dais">dais</a></p>
    </div>
  {/if}
  <div class="welcome-btns col4">
    <Btn bind:value={$welcome_mode} as="finish">終了した村</Btn>
    <Btn bind:value={$welcome_mode} as="progress">進行中の村</Btn>
  </div>
  <div class="welcome-btns col4 shoe">
    <a href={$url.top}>総合トップ</a>
  </div>
</div>

<style lang="scss">
.export {
  border-collapse: separate;
  border-spacing: 3px;
  padding: 40px 0;
  display: -ms-grid;
  display: grid;
  justify-content: center;
  grid-template-areas: '. . .';
  grid-gap: 0 4px;
}

.col4 {
  -ms-grid-column: 1;
  -ms-grid-column-span: 3;
  grid-column: 1/4;
}

.cap {
  border-radius: 9px 9px 0 0;
}

.welcome-btns {
  text-align: center;
  background-color: rgba(64, 82, 80, 0.8);
}

.welcome-links {
  padding: 0.5ex;
  background-color: rgba(23, 47, 31, 0.4);
}
</style>
