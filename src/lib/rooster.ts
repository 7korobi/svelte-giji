import * as R from 'roosterjs'

type SvelteCapture = {
  onEdit?: (e: R.PluginEvent) => void
  onInput?: (e: R.PluginEvent) => void
  onFormat?: (e: R.PluginEvent) => void
}

class Svelte implements R.EditorPlugin {
  private editor: R.Editor
  capture: SvelteCapture

  constructor(capture: SvelteCapture) {
    this.capture = capture
  }

  getName() {
    return 'Svelte'
  }

  initialize(editor: R.Editor) {
    this.editor = editor
  }

  dispose() {
    this.editor = null
  }

  onPluginEvent(e: R.PluginEvent) {
    switch (e.eventType) {
      case 12:
        this.capture.onInput?.(e)
      case 6:
      case 13:
        this.capture.onFormat?.(e)
        break
      case 0:
      case 5:
        this.capture.onEdit?.(e)
        break
    }
    console.log(e)
  }
}

const undo = new R.Undo(true)

export function options(capture: SvelteCapture) {
  return {
    undo,
    enableExperimentFeatures: true,
    defaultFormat: {},
    plugins: [
      new Svelte(capture),
      new R.Paste(),
      new R.ImageResize(),
      new R.TableResize(),
      new R.EntityPlugin(),
      new R.CustomReplace(),
      new R.HyperLink((url) => 'Ctrl+Click to follow the link:' + url),
      new R.ContentEdit(
        Object.assign(R.getDefaultContentEditFeatures(), {
          defaultShortcut: false,
          smartOrderedList: false
        })
      ),
      new R.PickerPlugin(
        {
          onInitalize: (insertNodeCallback, setIsSuggestingCallback) => {},
          onDispose: () => {},
          onIsSuggestingChanged: (isSuggesting) => {},
          queryStringUpdated: (queryString) => {},
          onRemove: (nodeRemoved, isBackwards) => null
        },
        {
          elementIdPrefix: 'samplepicker-',
          changeSource: 'SAMPLE_COLOR_PICKER',
          triggerCharacter: ':',
          isHorizontal: true
        }
      )
    ]
  }
}
