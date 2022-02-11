import Dexie from 'dexie';
import { __BROWSER__ } from 'svelte-petit-utils';
class WebPoll extends Dexie {}
export let webPoll = null;
if (__BROWSER__) {
  webPoll = new Dexie('poll-web');
  webPoll.version(1).stores({
    data: '&idx'
  });
}
