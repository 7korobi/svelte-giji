<script >import { observe } from './observer';
export let onPeep = () => {
    console.warn('not implement onPeep');
};
let isPeep = false;
let timer;
const tracker = observe(['peep', 'hidden'], {
    change(ops) {
        if (ops.state === 'peep') {
            timer = setInterval(onPeep, 200);
        }
        else {
            clearInterval(timer);
        }
    }
});
</script>

<div use:tracker.listener>
  <slot />
</div>
