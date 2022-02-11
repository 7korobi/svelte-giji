<script context="module">
import { derived } from 'svelte/store';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { live } from '../site';
import { app, token, topics, topicsAck } from './store';
import { __BROWSER__ } from 'svelte-petit-utils';
app.subscribe(initNotify);
async function initNotify($app) {
  if (!$app) return;
  if (!__BROWSER__) return;
  const messaging = getMessaging();
  try {
    const currentToken = await getToken(messaging, live.fcm);
    if (currentToken) {
      token.set(currentToken);
      console.warn(currentToken);
    } else {
      console.error('No registration token available. Request permission to generate one.');
    }
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // ...
    });
  } catch (e) {
    console.warn(e);
  }
}
const topicFixing = derived(
  [token, topics, topicsAck],
  ([$token, $topics, $topicsAck], set) => {
    if (!__BROWSER__) return;
    if (!$token) return;
    const appends = [];
    const deletes = [];
    for (const topic of $topics) {
      if (!$topicsAck.includes(topic)) {
        appends.push(topic);
      }
    }
    for (const topic of $topicsAck) {
      if (!$topics.includes(topic)) {
        deletes.push(topic);
      }
    }
    set([...appends, ...deletes]);
    fcm($token, appends, deletes)
      .then((result) => {
        if (result) topicsAck.set($topics);
      })
      .finally(() => {
        set([]);
      });
  },
  []
);
</script>

<script>
import { Btn } from '../design';
import { BellDisable, BellRinging, BellStop, Spinner } from '../icon';
import { fcm } from '../db/socket.io-client';
export let topic;
function bell($topicFixing, $token, $topics, topic) {
  if ($topicFixing.includes(topic)) return Spinner;
  if (!$token) return BellDisable;
  if ($topics.includes(topic)) {
    return BellRinging;
  } else {
    return BellStop;
  }
}
</script>

<Btn type="toggle" disabled={!$token} as={[topic]} bind:value={$topics}>
  <svelte:component this={bell($topicFixing, $token, $topics, topic)} />
  <slot />
</Btn>
