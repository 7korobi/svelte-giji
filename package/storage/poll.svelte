<script>
import { onDestroy } from 'svelte';
import { to_tempo } from 'svelte-tick-timer';
import { INTERVAL_MAX } from 'svelte-tick-timer';
import browser from 'svelte-browser';
import 'svelte-petit-utils';
import { webPoll } from './dexie';
const { isActive } = browser;
export let version = '1.0.0';
export let timer = '1d';
export let shift = '0s';
export let idx = '';
// for export.
export let onFetch = (pack) => {};
export let pack = undefined;
export let next_at = -Infinity;
// for requesting.
export let api_call = async () => {
  const req = await fetch(idx);
  return { version, idx, pack: await req.json() };
};
let timerId = 0;
$: tempo = to_tempo(timer, shift);
$: restart($isActive, { version, idx, timer });
$: if (pack) onFetch(pack);
function restart(is_active, o) {
  if (is_active && o.idx) {
    tick();
  } else {
    clearTimeout(timerId);
  }
}
onDestroy(() => {
  clearTimeout(timerId);
});
function logger(tempo, mode = '') {
  const wait = new Date().getTime() - tempo.write_at;
  console.log({ wait, idx, mode });
}
async function tick() {
  if (!webPoll) return;
  tempo = tempo.reset();
  try {
    if (tempo.write_at < next_at) {
      logger(tempo);
    } else {
      // IndexedDB metadata not use if memory has past data,
      console.log(idx);
      const data = await webPoll.data.get(idx);
      if (data && data.version === version) {
        get_by_cache(tempo, data);
        if (data.next_at <= tempo.write_at) {
          await get_by_api(tempo, await api_call());
        }
      } else {
        await get_by_api(tempo, await api_call());
      }
    }
    next_at = tempo.next_at;
  } catch (e) {
    console.error({ idx, version }, e);
  }
  if (tempo.timeout < INTERVAL_MAX) {
    // 25days
    timerId = setTimeout(tick, tempo.timeout);
  }
}
function get_by_cache(tempo, cache) {
  pack = cache.pack;
  logger(tempo, '(cache)');
}
async function get_by_api(tempo, api) {
  api.next_at = tempo.next_at;
  api.next_time = new Date(tempo.next_at).toLocaleString();
  await webPoll.data.put(api);
  pack = api.pack;
  logger(tempo, '(api)');
}
</script>

<div />
