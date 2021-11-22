<script lang="ts">
import * as R from 'roosterjs'
import { getPendableFormatState } from 'roosterjs-editor-dom'
import { getElementBasedFormatState } from 'roosterjs-editor-api/lib/format/getFormatState'
import { options } from '../lib/rooster'

export let editor: R.Editor

let div: HTMLDivElement
let edits = {
  isInIME: false,

  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikeThrough: false,
  isSubscript: false,
  isSuperscript: false,

  isBullet: false,
  isNumbering: false,
  isBlockQuote: false,
  canUnlink: false,
  canAddImageAltText: false,
  headerLevel: 0
}
let inputs = {
  canUndo: false,
  canRedo: false,
  isEmpty: false
}

let document: Document
let text: string
let html: string

$: init(div)

function init(div) {
  if (div) {
    editor = new R.Editor(
      div,
      options({
        onEdit(e) {
          console.log(
            editor.getSelection(),
            editor.getSelectionRange(),
            editor.getSelectionPath(),
            editor.getFocusedPosition(),
            editor.getCursorRect()
          )
          edits = {
            ...edits,
            ...getPendableFormatState(editor.getDocument()),
            ...getElementBasedFormatState(editor),
            isInIME: editor.isInIME()
          }
        },
        onInput(e) {
          inputs = {
            canUndo: editor.canUndo(),
            canRedo: editor.canRedo(),
            isEmpty: editor.isEmpty()
          }
          document = editor.getDocument()
          //html = editor.getContent(true, false)
          text = editor.getTextContent()
        },
        onFormat(e) {}
      })
    )
  }
}
</script>

<div class="editor" bind:this={div} />
<div>
  <button on:click={() => R.toggleBold(editor)}><b>◯</b></button>
  <button on:click={() => R.toggleItalic(editor)}><i>◯</i></button>
  <button on:click={() => R.toggleStrikethrough(editor)}><s>◯</s></button>
  <button on:click={() => R.toggleSubscript(editor)}><sub>◯</sub></button>
  <button on:click={() => R.toggleSuperscript(editor)}><sup>◯</sup></button>
  &nbsp;
  <button on:click={() => R.clearBlockFormat(editor)}>◯</button>
  <button on:click={() => R.toggleHeader(editor, 1)}><h1>◯</h1></button>
  <button on:click={() => R.toggleHeader(editor, 2)}><h2>◯</h2></button>
  <button on:click={() => R.toggleHeader(editor, 3)}><h3>◯</h3></button>
  <button on:click={() => R.toggleHeader(editor, 4)}><h4>◯</h4></button>
  <button on:click={() => R.toggleHeader(editor, 5)}><h5>◯</h5></button>
  <button on:click={() => R.toggleHeader(editor, 6)}><h6>◯</h6></button>
  &nbsp;
  <button on:click={() => R.toggleBlockQuote(editor)}><blockquote>◯</blockquote></button>
  <button on:click={() => R.toggleCodeBlock(editor)}><pre><code>◯</code></pre></button>
  <button on:click={() => R.toggleBullet(editor)}
    ><ul>
      <li>◯</li>
    </ul></button
  >
  <button on:click={() => R.toggleNumbering(editor)}
    ><ol>
      <li>◯</li>
    </ol></button
  >
  &nbsp;
  {#if inputs.canUndo}<button on:click={() => editor.undo()}>⏪</button>{/if}
  {#if inputs.canRedo}<button on:click={() => editor.redo()}>⏩</button>{/if}

  {JSON.stringify(edits)}
  {JSON.stringify(inputs)}
  {text}
</div>

<style lang="scss">
.editor {
  width: 100%;
  height: 300px;
  overflow: auto;
}
</style>
