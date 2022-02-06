import type { Socket } from 'socket.io'
import type { ServiceAccount } from 'firebase-admin'
import type { MessagingTopicManagementResponse } from 'firebase-admin/lib/messaging/messaging-api'
import { App, cert, initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import json from '../site/json/live-server.json'

const app: App = initializeApp({
  credential: cert(json.firebase.admin_cert)
})

export async function fcm(
  socket: Socket,
  token: string,
  appends: string[],
  deletes: string[],
  done: (topics: boolean) => void
) {
  let result = true

  for (const topic of appends) {
    const { successCount, failureCount, errors } = await getMessaging(app).subscribeToTopic(
      token,
      topic
    )
    if (failureCount) result = false
    console.log('append', topic, errors, token)
  }
  for (const topic of deletes) {
    const { successCount, failureCount, errors } = await getMessaging(app).unsubscribeFromTopic(
      token,
      topic
    )
    if (failureCount) result = false
    console.log('delete', topic, errors, token)
  }
  console.log('done', result)
  done(result)
}
