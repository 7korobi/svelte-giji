<script lang="ts">
import talk from './talk.svelte'
import post from './post.svelte'
import report from './report.svelte'
import logo from './logo.svelte'
import cast from './cast.svelte'

import Mention from '../inline/mention.svelte'
import type { BookPhase, BookStory } from '$lib/pubsub/map-reduce'
const sveltes = { talk, post, report, logo, cast }

export let show: keyof typeof sveltes
export let handle: string = 'VSSAY'
export let face_id: string = ''

export let log: string = ''
export let deco: 'mono' | 'head' | 'mono head' | 'head mono' | '' = ''

export let to: string = ''
export let name: string = ''

export let _id: string
export let story: BookStory
export let phase: BookPhase

$: html = sow(log)

function link(href: string, title?: string, text?: string) {
  const [protocol, hostname] = href.split(/\:\/\/|\/|\?|\#/g)
  text ||= protocol
  title ||= [protocol,hostname].join("\n")
  if ([null, undefined, "", "#"].includes(href)) {
    if (title) {
      return `<q title="${title}">${text}</q>`
    } else {
      return `<q>${text}</q>`
    }
  } else {
    if (/\.(?:jpg|jpeg|png|gif|bmp)$/i.test(href)) {
      if (title) {
        return `<img href="${href}" src="${href}" title="${title}" />`
      } else {
        return `<img href="${href}" src="${href}" title="${text}" />`
      }
    } else {
      if (title) {
        return `<a href="${href}" src="${href}" title="${title}">${text}</a>`
      } else {
        return `<a href="${href}" src="${href}">${text}</a>`
      }
    }
  }
}

function sow(log: string) {
  log = log.replace(reg_sow_strong1, dress_sow_strong1)
  log = log.replace(reg_sow_strong2, dress_sow_strong2)
  log = log.replace(reg_sow_writing, dress_sow_writing)
  log = log.replace(reg_sow_hide,dress_sow_hide)
  log = log.replace(reg_sow_label,dress_sow_label)
  log = log.replace(reg_sow_url,dress_sow_url)
  log = log.replace(reg_sow_rand,dress_sow_rand)
  return log
}

const reg_sow_strong1 = /<strong>([^<]*?)<\/strong><sup>([^<]*?)<\/sup>/g
function dress_sow_strong1(tag: string, item: string, title: string, idx: number, src: string){
  console.log(title, item)
  return `<kbd title="${title}">${item}</kbd>`
}

const reg_sow_strong2 = /<a\ title="([^"]*?)"><strong>([^<]*?)<\/strong><\/a>/g
function dress_sow_strong2(tag: string, title: string, item: string, idx: number, src: string){
  console.log(title, item)
  return `<kbd title="${title}">${item}</kbd>`
}

const reg_sow_writing = /(<br>\n?|^)(\s*)([\[［][^\]］]*[\]］])(<br>|$)/g
function dress_sow_writing(human: string, pre: string, preSpc: string, outer: string, post: string, idx: number, src: string){
  const head = outer[0]
  const tail = outer.slice(-1)
  const inner = outer.slice(1, -1)
  console.log( pre, preSpc, head, inner, tail, post )
  // return `${pre}<del>${head}</del><tt>${inner}</tt><del>${tail}</del>${post}`
  return `${pre}<blockquote>${inner}</blockquote>`
}

const reg_sow_hide = /(\/\*)([\s\S]*)(\*\/)|(^)([\s\S]*)(\*\/)|(\/\*)([\s\S]*)($)/g
function dress_sow_hide(human: string, head1: string, inner1: string, tail1: string, head2: string, inner2: string, tail2: string, head3: string, inner3: string, tail3: string, idx: number, src: string){
  console.log( head1 || head2 || head3, inner1 || inner2 || inner3, tail1 || tail2 || tail3 )
  return `<del>${human}</del>`
}

const reg_sow_label = /<strong>([^<]*?)<\/strong>/g
function dress_sow_label(tag: string, item: string, idx: number, src: string){
  console.log(item)
  return `<label>${item}</label>`
}

const reg_sow_url = /[a-z]+:\/\/[^\s<]+[^<.,:;"'\)\]\s]/g
function dress_sow_url(url: string, idx: number, src: string) {
  if ('<a href="' == src.slice(idx - 9, idx).toLowerCase()) return url
  let suffix = ""
  url = url.replace(/&lt;$|&gt;$|\]$|\[$/, (tail)=>{
    suffix = tail
    return ""
  })
  console.log(url, suffix)
  return `${link(url)}${suffix}`
}

const reg_sow_rand = /<rand\s+([^>]*)>/g
function dress_sow_rand(tag: string, list: string, idx: number, src: string) {
  const [item, title] = list.split(",")
  console.log(title, item)
  return `<kbd title="${title}">${item}</kbd>`
}

</script>

<svelte:component this={sveltes[show]} {handle} {face_id} {story}>
  {#if name}
    {#if to}
      <p class="name c">
        <span class="pull-right">{to}</span>▷<span class="pull-left">{name}</span>
      </p>
    {:else}
      <p class="name">
        {#if phase}<sup class="fine pull-right">{phase.label}</sup>{/if}
        {name}
      </p>
    {/if}
    <hr />
  {/if}
  <p class={`text ${deco}`}>
    {#if html}
      {@html html}
    {:else}
      <slot />
    {/if}
  </p>
  {#if _id}
    <p class="date">
      <Mention id={_id} let:mention>{mention}</Mention>
    </p>
  {/if}
</svelte:component>
