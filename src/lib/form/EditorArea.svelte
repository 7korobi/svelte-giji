<script lang="ts">
import EditorJS, { API } from '@editorjs/editorjs'

import { Strong, Bold, Italic, Del, Ins, Code, Kbd, Sup, Sub, Mark } from '../editor'

import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import Header from '@editorjs/header'
import LinkTool from '@editorjs/link'
import List from '@editorjs/list'
import Paragraph from '@editorjs/paragraph'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'

import Undo from 'editorjs-undo'

let div
let editor

$: editor = new EditorJS({
  holder: 'editorjs',
  placeholder: '心を込めて！',
  tools: {
    chk: { class: CheckList, inlineToolbar: true },
    hr: { class: Delimiter, inlineToolbar: true },
    p: { class: Paragraph, inlineToolbar: true },
    q: { class: Quote, inlineToolbar: true },
    head: { class: Header, inlineToolbar: true },
    list: { class: List, inlineToolbar: true },
    link: {
      class: LinkTool,
      config: {
        endpoint: 'https://codex.so/editor/fetchUrl'
      }
    },
    Strong,
    Bold,
    Italic,
    Del,
    Ins,
    Code,
    Kbd,
    Sup,
    Sub,
    Mark
  },
  onChange(api) {
    refresh(api)
    // console.log(api)
    console.log(this)
  },
  onReady: () => {
    const undo = new Undo({ editor })
    // undo.initialize([])
  }
})

async function refresh(api: API) {
  const data = await api.saver.save()
  console.log(data)
}
</script>

<div id="editorjs" bind:this={div} />
