<script>
import { observe } from './observer';
const COMPRESS = 'compress';
const HIDDEN = 'hidden';
const PEEP = 'peep';
const SHOW = 'show';
const FOCUS = 'focus';
export let name = '';
export let range = [COMPRESS, HIDDEN, PEEP, SHOW, FOCUS];
export let focus = '';
export let state = '';
const tracker = observe(range, {
  change(ops) {
    focus = ops.focus;
    state = ops.state;
  }
});
$: tracker;
</script>

<div {name} use:tracker.listener>
  <slot />
</div>
