import { __BROWSER__ } from 'svelte-petit-utils';
const resized = new Map();
const resizes =
  __BROWSER__ &&
  new ResizeObserver(([entry]) => {
    const { offsetWidth, offsetHeight } = entry.target;
    resized.get(entry.target)([offsetWidth, offsetHeight]);
  });
export function onResize(el, cb) {
  console.log('init resizer', el);
  update(cb);
  resized.set(el, cb);
  resizes.observe(el);
  return { update, destroy };
  function update(newCb) {
    cb = newCb;
    console.log('update resizer', cb);
    resized.set(el, cb);
    const { offsetWidth, offsetHeight } = el;
    cb([offsetWidth, offsetHeight]);
    return;
  }
  function destroy() {
    resizes.unobserve(el);
    resized.delete(el);
  }
}
