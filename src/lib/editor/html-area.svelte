<script lang="ts">
import { onDestroy } from 'svelte'
import { __BROWSER__ } from '$lib/browser/device'
import * as Icon from '$lib/icon'
import Undo from '$lib/icon/ui/undo.svelte'

export let disable = false
export let showHTML = true
export let html = ''
let article: HTMLElement

// $: setDocMode(showHTML)

function editor(node: HTMLElement) {
  article = node

  document.execCommand('defaultParagraphSeparator', false, 'p')
  document.execCommand('styleWithCSS', false, false as any)
  document.addEventListener('selectionchange', selectionChange)

  onDestroy(() => {
    document.removeEventListener('selectionchange', selectionChange)
  })
}

function parseHtml(el: HTMLElement) {
  const name = el.nodeName
  const cssNames = el.classList?.value
  const attrs = el.attributes
  switch (name) {
    case 'DIV':
      return `<P>${toHtml(el)}</P>`

    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
    case 'OL':
    case 'UL':
    case 'LI':
      return `<${name}>${toHtml(el)}</${name}>`

    case 'P':
      return `<${name} class="${cssNames}">${toHtml(el)}</${name}>`

    case 'SPAN':
      return toHtml(el)

    case 'A':
      console.log(attrs)
      return `<${name}>${toHtml(el)}</${name}>`

    case 'RUBY':
    case 'RB':
    case 'RT':
      return `<${name}>${toHtml(el)}</${name}>`

    case 'HR':
    case 'BR':
      return `<${name} />`

    case '#text':
      return el.nodeValue

    default:
      return ''
  }
}

function toHtml(el: ChildNode) {
  const htmls = []
  el.childNodes.forEach((node) => {
    htmls.push(parseHtml(node as HTMLElement))
  })
  return htmls.join('')
}

function cut(e: ClipboardEvent) {
  console.log(e.clipboardData)
}

function copy(e: ClipboardEvent) {
  console.log(e.clipboardData)
}

function paste(e: ClipboardEvent) {
  const el = document.createElement('article')
  if (e.clipboardData.types.includes('text/html')) {
    el.innerHTML = e.clipboardData.getData('text/html')
    el.innerHTML = toHtml(el)
    selected(el)
    return
  }
  if (e.clipboardData.types.includes('text/plain')) {
    el.textContent = e.clipboardData.getData('text/html')
    selected(el)
    return
  }
}

function selected(el: HTMLElement) {
  const selection = document.getSelection()
  const length = selection.rangeCount
  const range = selection.getRangeAt(length - 1)

  console.log(range.extractContents())
  range.insertNode(el)
}

function selectionChange(e) {
  console.log(e)
}

function formatDoc(sCmd: string, sValue: string = undefined) {
  document.execCommand(sCmd, false, sValue)
  article.focus()
}

function setDocMode(bToSource) {
  if (bToSource) {
    const oContent = document.createTextNode(article.innerHTML)
    article.contentEditable = 'false'
    article.innerHTML = ''

    const oPre = document.createElement('pre')
    oPre.id = 'sourceText'
    oPre.contentEditable = 'true'
    oPre.appendChild(oContent)

    article.appendChild(oPre)
    document.execCommand('defaultParagraphSeparator', false, 'p')
  } else {
    const oContent = document.createRange()
    oContent.selectNodeContents(article)
    article.innerHTML = (oContent.commonAncestorContainer as HTMLElement).innerHTML
    article.contentEditable = 'true'
  }
}
</script>

<article
  contenteditable="true"
  class:disable
  use:editor
  bind:this={article}
  bind:innerHTML={html}
  on:selectstart={(e) => console.log(e)}
  on:cut={cut}
  on:copy={copy}
  on:paste|preventDefault={paste}
  on:input={(e) => console.log(e)}
/>
<!-- svelte-ignore a11y-no-onchange -->
<div id="toolBar1">
  <select
    on:change={() => {
      formatDoc('formatblock', this[this.selectedIndex].value)
      this.selectedIndex = 0
    }}
  >
    <option selected>- formatting -</option>
    <option value="h1">Title 1 &lt;h1&gt;</option>
    <option value="h2">Title 2 &lt;h2&gt;</option>
    <option value="h3">Title 3 &lt;h3&gt;</option>
    <option value="h4">Title 4 &lt;h4&gt;</option>
    <option value="h5">Title 5 &lt;h5&gt;</option>
    <option value="h6">Subtitle &lt;h6&gt;</option>
    <option value="p">Paragraph &lt;p&gt;</option>
    <option value="pre">Preformatted &lt;pre&gt;</option>
  </select>
  <select
    on:change={() => {
      formatDoc('fontname', this[this.selectedIndex].value)
      this.selectedIndex = 0
    }}
  >
    <option class="heading" selected>- font -</option>
    <option>Arial</option>
    <option>Arial Black</option>
    <option>Courier New</option>
    <option>Times New Roman</option>
  </select>
  <select
    on:change={() => {
      formatDoc('fontsize', this[this.selectedIndex].value)
      this.selectedIndex = 0
    }}
  >
    <option class="heading" selected>- size -</option>
    <option value="1">Very small</option>
    <option value="2">A bit small</option>
    <option value="3">Normal</option>
    <option value="4">Medium-large</option>
    <option value="5">Big</option>
    <option value="6">Very big</option>
    <option value="7">Maximum</option>
  </select>
  <select
    on:change={() => {
      formatDoc('forecolor', this[this.selectedIndex].value)
      this.selectedIndex = 0
    }}
  >
    <option class="heading" selected>- color -</option>
    <option value="red">Red</option>
    <option value="blue">Blue</option>
    <option value="green">Green</option>
    <option value="black">Black</option>
  </select>
  <select
    on:change={() => {
      formatDoc('backcolor', this[this.selectedIndex].value)
      this.selectedIndex = 0
    }}
  >
    <option class="heading" selected>- background -</option>
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="black">Black</option>
  </select>
</div>
<!-- svelte-ignore a11y-missing-attribute -->
<div id="toolBar2">
  <button
    class="intLink"
    title="Undo"
    on:click={() => {
      formatDoc('undo')
    }}><Icon.Undo /></button
  >
  <button
    class="intLink"
    title="Redo"
    on:click={() => {
      formatDoc('redo')
    }}><Icon.Redo /></button
  >
  <button
    class="intLink"
    title="Remove formatting"
    on:click={() => {
      formatDoc('removeFormat')
    }}><Icon.RemoveFormat /></button
  >
  <button
    class="intLink"
    title="Bold"
    on:click={() => {
      formatDoc('bold')
    }}><Icon.Bold /></button
  >
  <button
    class="intLink"
    title="Italic"
    on:click={() => {
      formatDoc('emphasis')
    }}><Icon.Emphasis /></button
  >
  <button
    class="intLink"
    title="Underline"
    on:click={() => {
      formatDoc('underline')
    }}><Icon.Underline /></button
  >
  <button
    class="intLink"
    title="Left align"
    on:click={() => {
      formatDoc('justifyleft')
    }}><Icon.AlignLeft /></button
  >
  <button
    class="intLink"
    title="Center align"
    on:click={() => {
      formatDoc('justifycenter')
    }}><Icon.AlignCenter /></button
  >
  <button
    class="intLink"
    title="Right align"
    on:click={() => {
      formatDoc('justifyright')
    }}><Icon.AlignRight /></button
  >
  <button
    class="intLink"
    title="Numbered list"
    on:click={() => {
      formatDoc('insertorderedlist')
    }}><Icon.TocOn /></button
  >
  <button
    class="intLink"
    title="Dotted list"
    on:click={() => {
      formatDoc('insertunorderedlist')
    }}><Icon.TocOff /></button
  >
  <button
    class="intLink"
    title="Quote"
    on:click={() => {
      formatDoc('formatblock', 'blockquote')
    }}><Icon.Tropical /></button
  >
  <button
    class="intLink"
    title="Delete indentation"
    on:click={() => {
      formatDoc('outdent')
    }}><Icon.Outdent /></button
  >
  <button
    class="intLink"
    title="Add indentation"
    on:click={() => {
      formatDoc('indent')
    }}><Icon.Indent /></button
  >
  <button
    class="intLink"
    title="Hyperlink"
    on:click={() => {
      var sLnk = prompt('Write the URL here', 'http://')
      if (sLnk && sLnk != '' && sLnk != 'http://') {
        formatDoc('createlink', sLnk)
      }
    }}><Icon.LinkOn /></button
  >
  <button
    class="intLink"
    title="Cut"
    on:click={() => {
      formatDoc('cut')
    }}><Icon.Cut /></button
  >
  <button
    class="intLink"
    title="Copy"
    on:click={() => {
      formatDoc('copy')
    }}><Icon.Copy /></button
  >
  <button
    class="intLink"
    title="Paste"
    on:click={() => {
      formatDoc('paste')
    }}><Icon.Paste /></button
  >
</div>
<div>{showHTML ? html : ''}</div>

<style lang="scss">
</style>
