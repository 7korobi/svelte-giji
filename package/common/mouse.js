export function clip({ target }) {
    doClip(target);
}
function doClip(target) {
    const range = document.createRange();
    range.selectNode(target);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().empty();
}
