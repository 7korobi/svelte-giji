import type { SanitizerConfig, API } from '@editorjs/editorjs'
import type {
  BlockToolConstructorOptions,
  InlineToolConstructorOptions
} from '@editorjs/editorjs/types/tools'
import { listen } from 'svelte/internal'

type Align = '' | 'center' | 'right'

type HRData = {
  type: '' | 'footnote' | 'stripe' | 'blank'
}

type BlockData = {
  html: string
  align: Align
}

class Block {
  static isReadOnlySupported = true
  static enableLineBreaks = false
  static toolbox = {
    icon: '',
    title: ''
  }
  static conversionConfig = {
    import(html: string): BlockData {
      const match = html.match(/<(|center|right) \/>$/i)
      if (match) {
        return {
          align: match[1].toLowerCase() as Align,
          html: html.slice(0, match.index)
        }
      } else {
        return {
          align: '',
          html
        }
      }
    },
    export(data: BlockData): string {
      return `${data.html}<${data.align} />`
    }
  }
  static sanitize = {
    html: {
      br: false
    },
    align: {}
  }

  api: API
  readOnly: boolean
  data: BlockData

  title?: string
  isInline = false

  constructor({ data, api, readOnly, config, block }: BlockToolConstructorOptions<BlockData, {}>) {
    this.api = api
    this.readOnly = readOnly
    this.data = {
      html: data.html || '',
      align: data.align || ''
    }
  }

  save(el: HTMLElement) {
    let align = ''
    if (el.classList.contains('center')) align = 'center'
    if (el.classList.contains('right')) align = 'right'
    return Object.assign(this.data, {
      align,
      html: el.innerHTML
    })
  }

  render() {
    const { input, block } = this.api.styles
    return dom('blockquote', [], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.html
    })
  }

  renderSettings() {
    const settingsWrapper = 'cdx-quote-settings'
    const { settingsButton, settingsButtonActive } = this.api.styles

    const btns = [
      dom('button', [settingsButton], {
        innerHTML: `<svg width="16" height="11" viewBox="0 0 16 11" xmlns="http://www.w3.org/2000/svg" ><path d="M1.069 0H13.33a1.069 1.069 0 0 1 0 2.138H1.07a1.069 1.069 0 1 1 0-2.138zm0 4.275H9.03a1.069 1.069 0 1 1 0 2.137H1.07a1.069 1.069 0 1 1 0-2.137zm0 4.275h9.812a1.069 1.069 0 0 1 0 2.137H1.07a1.069 1.069 0 0 1 0-2.137z" /></svg>`,
        title: 'Left alignment'
      }),
      dom('button', [settingsButton], {
        innerHTML: `<svg width="16" height="11" viewBox="0 0 16 11" xmlns="http://www.w3.org/2000/svg" ><path d="M1.069 0H13.33a1.069 1.069 0 0 1 0 2.138H1.07a1.069 1.069 0 1 1 0-2.138zm3.15 4.275h5.962a1.069 1.069 0 0 1 0 2.137H4.22a1.069 1.069 0 1 1 0-2.137zM1.069 8.55H13.33a1.069 1.069 0 0 1 0 2.137H1.07a1.069 1.069 0 0 1 0-2.137z"/></svg>`,
        title: 'Center alignment'
      }),
      dom('button', [settingsButton], {
        innerHTML: ``,
        title: 'Right alignment'
      })
    ]
    const bye1 = listen(btns[0], 'click', () => {
      this.data.align = ''
      refresh()
    })
    const bye2 = listen(btns[1], 'click', () => {
      this.data.align = 'center'
      refresh()
    })
    const bye3 = listen(btns[2], 'click', () => {
      this.data.align = 'right'
      refresh()
    })
    refresh()

    return dom('div', [settingsWrapper], {}, btns)

    function refresh() {
      btns[0].classList.toggle(settingsButtonActive, '' === this.data.align)
      btns[1].classList.toggle(settingsButtonActive, 'center' === this.data.align)
      btns[2].classList.toggle(settingsButtonActive, 'right' === this.data.align)
    }
  }
}

export class P extends Block {
  static toolbox = {
    icon: '',
    title: 'Paragraph'
  }
  tag = 'P'
}

export class Q extends Block {
  static toolbox = {
    icon:
      '<svg width="15" height="14" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg"><path d="M13.53 6.185l.027.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.569-1.568l4.838-4.837L6.396 2.23A1.125 1.125 0 1 1 7.986.64l5.52 5.518.025.027zm-5.815 0l.026.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.568-1.568l4.837-4.837L.58 2.23A1.125 1.125 0 0 1 2.171.64L7.69 6.158l.025.027z" /></svg>',
    title: 'Quote'
  }
  tag = 'BLOCKQUOTE'
}

export class H1 extends Block {
  static toolbox = {
    icon: '',
    title: 'H1'
  }
  tag = 'H1'
}

export class H2 extends Block {
  static toolbox = {
    icon: '',
    title: 'H2'
  }
  tag = 'H2'
}

export class H3 extends Block {
  static toolbox = {
    icon: '',
    title: 'H3'
  }
  tag = 'H3'
}

export class H4 extends Block {
  static toolbox = {
    icon: '',
    title: 'H4'
  }
  tag = 'H4'
}

export class H5 extends Block {
  static toolbox = {
    icon: '',
    title: 'H5'
  }
  tag = 'H5'
}

export class H6 extends Block {
  static toolbox = {
    icon: '',
    title: 'H6'
  }
  tag = 'H6'
}

export class HR {
  static contentless = true
  static toolbox = {
    icon: '',
    title: 'HR'
  }
  static conversionConfig = {
    import(html: string): HRData {
      const match = html.match(/<HR \/>|<HR class="(|footnote|stripe|blank)" \/>$/i)
      if (match) {
        return {
          type: match[1].toLowerCase() as HRData['type']
        }
      } else {
        return {
          type: ''
        }
      }
    },
    export(data: HRData): string {
      return `<HR class="${data.type}" />`
    }
  }
  static sanitize = {
    text: {
      br: false
    },
    align: {}
  }

  tag = 'HR'

  api: API
  readOnly: boolean
  data: HRData
  constructor({ data, api, readOnly, config, block }: BlockToolConstructorOptions<HRData, {}>) {
    this.api = api
    this.readOnly = readOnly
    this.data = {
      type: data.type || ''
    }
  }
}

class Inline {
  static isInline = true
  static title = ''

  static sanitize = {} as SanitizerConfig

  static toolbox = {
    icon: '',
    title: ''
  }

  button: HTMLElement
  api: API
  tag: string
  icon: string

  constructor({ api, config }: InlineToolConstructorOptions) {
    this.api = api
  }

  surround(range) {
    if (!range) return

    const term = this.api.selection.findParentTag(this.tag)
    if (term) {
      this.unwrap(term)
    } else {
      this.wrap(range)
    }
  }

  wrap(range) {
    const el = dom(this.tag, [], {}, [range.extractContents()])
    range.insertNode(el)
    this.api.selection.expandToTag(el)
  }

  unwrap(term) {
    this.api.selection.expandToTag(term)

    let sel = window.getSelection()
    let range = sel.getRangeAt(0)

    let child = range.extractContents()

    term.parentNode.removeChild(term)
    range.insertNode(child)

    sel.removeAllRanges()
    sel.addRange(range)
  }

  render() {
    const { inlineToolButton } = this.api.styles
    return (this.button = dom('button', [inlineToolButton], {
      type: 'button',
      innerHTML: this.icon
    }))
  }

  checkState() {
    const { inlineToolButtonActive } = this.api.styles
    const termTag = this.api.selection.findParentTag(this.tag)
    this.button.classList.toggle(inlineToolButtonActive, !!termTag)
  }
}

export class Strong extends Inline {}
export class Bold extends Inline {}

export class Italic extends Inline {}
export class Code extends Inline {}
export class Mark extends Inline {}
export class Del extends Inline {}
export class Ins extends Inline {}
export class Kbd extends Inline {}
export class Sup extends Inline {}
export class Sub extends Inline {}

inline(
  Strong,
  'STRONG',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)
inline(
  Bold,
  'B',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)
inline(
  Italic,
  'I',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)
inline(
  Code,
  'CODE',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)
inline(
  Mark,
  'MARK',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)
inline(
  Del,
  'DEL',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)
inline(
  Ins,
  'INS',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)
inline(
  Kbd,
  'KBD',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)
inline(
  Sup,
  'SUP',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)
inline(
  Sub,
  'SUB',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 13 12" width="13" height="12"><path d="M8.367 9.633L10.7 10.98l-.624 1.135-.787-.025-.78 1.35H6.94l1.193-2.066-.407-.62.642-1.121zm.436-.763l2.899-5.061a1.278 1.278 0 011.746-.472c.617.355.835 1.138.492 1.76l-2.815 5.114-2.322-1.34zM2.62 11.644H5.39a.899.899 0 110 1.798H2.619a.899.899 0 010-1.798z"/></svg>`
)

function dom(
  tag: string,
  classNames: string[] = [],
  attr: { [key: string]: any } = {},
  children: HTMLElement[] = []
) {
  const el = document.createElement(tag)
  el.classList.add(...classNames)
  Object.assign(el, attr)
  for (const child of children) {
    el.appendChild(child)
  }
  return el
}

function inline(klass, tag: string, icon: string) {
  const title = tag
  const sanitize = {} as SanitizerConfig
  sanitize[tag] = true

  Object.assign(klass, {
    toolbox: { icon, title },
    title,
    sanitize
  })
  Object.assign(klass.prototype, {
    klass,
    tag,
    icon
  })
}
