<script lang="ts" context="module">
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { live } from '$lib/site'
import { app, token, topics } from './store'
import { __BROWSER__ } from '$lib/common'

app.subscribe(initNotify)

async function initNotify($app) {
  if (!$app) return
  if (!__BROWSER__) return
  const messaging = getMessaging()
  try {
    const currentToken = await getToken(messaging, live.fcm)

    if (currentToken) {
      token.set(currentToken)
      console.warn(currentToken)
    } else {
      console.error('No registration token available. Request permission to generate one.')
    }

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload)
      // ...
    })
  } catch (e) {
    console.warn('An error occurred while retrieving token. ', e)
  }
}
</script>

<script lang="ts">
import { Btn } from '$lib/design'
import { BellDisable, BellRinging, BellStop } from '$lib/icon'

export let topic: any

function bell($token: string, $topics: string[], topic: string) {
  if ($token) {
    if ($topics.includes(topic)) {
      return BellRinging
    } else {
      return BellStop
    }
  } else {
    return BellDisable
  }
}
</script>

<Btn type="toggle" disabled={!$token} as={[topic]} bind:value={$topics}>
  <svelte:component this={bell($token, $topics, topic)} />
  <slot />
</Btn>
