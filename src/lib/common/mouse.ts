export function clip({ target }: { target: Node | EventTarget }) {
  doClip(target as Node)
}

function doClip(target: Node) {
  const range = document.createRange()
  range.selectNode(target)
  window.getSelection().addRange(range)
  document.execCommand('copy')
  window.getSelection().empty()
}
