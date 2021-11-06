import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import Header from '@editorjs/header'
import LinkTool from '@editorjs/link'
import List from '@editorjs/list'
import Paragraph from '@editorjs/paragraph'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'

import { Strong, Bold, Italic, Del, Ins, Code, Kbd, Sup, Sub, Mark } from './editorjs-define'

export const tools = {
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
}
