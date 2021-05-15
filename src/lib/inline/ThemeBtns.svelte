<script lang="ts">
import { __BROWSER__ } from '$lib/device'

import Btn from './Btn.svelte'

let zoom = 'BG'
let font = 'novel'
let theme = 'cinema'
let day = 'day'

$: if (__BROWSER__) {
  document.documentElement.className = [zoom, font, day, theme].join(' ')
}

$: switch (theme) {
  case 'cinema':
  case 'pop':
  case 'snow':
  case 'wa':
    day = 'day'
    break
  case 'star':
  case 'night':
  case 'moon':
    day = 'night'
    break
}
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/index.css" />
  <link rel="stylesheet" href="/css/log-{day}.css" />
  <link rel="stylesheet" href="/css/theme-{theme}.css" />
</svelte:head>

<div class="btns form">
  <span>
    <Btn as="BG" bind:value={zoom}>１</Btn>
    <Btn as="BG75" bind:value={zoom}>¾</Btn>
    <Btn as="BG50" bind:value={zoom}>½</Btn>
  </span>
  <span>
    <Btn as="large" bind:value={font}>大判</Btn>
    <Btn as="novel" bind:value={font}>明朝</Btn>
    <Btn as="press" bind:value={font}>新聞</Btn>
  </span>
  <span>
    <Btn as="goth-L" bind:value={font}>L</Btn>
    <Btn as="goth-M" bind:value={font}>M</Btn>
    <Btn as="goth-S" bind:value={font}>S</Btn>
  </span>
  <span>
    <Btn as="cinema" bind:value={theme}>煉瓦</Btn>
    <Btn as="pop" bind:value={theme}>💭</Btn>
    <Btn as="snow" bind:value={theme}>雪景</Btn>
    <Btn as="star" bind:value={theme}>蒼穹</Btn>
    <Btn as="night" bind:value={theme}>闇夜</Btn>
    <Btn as="moon" bind:value={theme}>月夜</Btn>
    <Btn as="wa" bind:value={theme}>和の国</Btn>
  </span>
</div>
