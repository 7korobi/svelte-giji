<script lang="ts" context="module">
import { derived } from 'svelte/store'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { live } from '$lib/site'
import { app, token, topics, topicsAck } from './store'
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
const notify = derived([token, topics, topicsAck], ([$token, $topics, $topicsAck], set) => {
  if (!__BROWSER__) return
  if (!$token) return

  const appends = []
  const deletes = []
  for (const topic of $topics) {
    if ($topicsAck.includes(topic)) return
    appends.push(topic)
  }
  for (const topic of $topicsAck) {
    if ($topics.includes(topic)) return
    deletes.push(topic)
  }

  set(undefined)
  fcm($token, appends, deletes).then((result) => {
    if (result) {
      topicsAck.set($topics)
    }
    set(result)
  })
})
</script>

<script lang="ts">
import { Btn } from '$lib/design'
import { BellDisable, BellRinging, BellStop } from '$lib/icon'
import { fcm } from '$lib/db/socket.io-client'

export let topic: any

$: console.log($notify, $topics, $topicsAck)

function bell($notify, $token: string, $topics: string[], topic: string) {
  if (undefined === $notify) return BellDisable
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
  <svelte:component this={bell($notify, $token, $topics, topic)} />
  <slot />
</Btn>
