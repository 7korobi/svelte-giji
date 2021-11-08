import { onBackgroundMessage, getMessaging, isSupported } from 'firebase/messaging/sw'
import { initializeApp, FirebaseOptions } from 'firebase/app'
import { build, files, timestamp } from '$service-worker'
import live from '$lib/site/json/live.json'

console.log({ build, files, timestamp })

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const fireApp = initializeApp(live.firebase)

self.addEventListener('activate', (event: any) => {
  event.waitUntil((self as any).clients.claim())
})

isSupported()
  .then((_is_support) => {
    const messaging = getMessaging(fireApp)

    onBackgroundMessage(messaging, ({ notification }) => {
      const { title, body, image } = notification ?? {}

      if (!title) {
        return
      }

      ;(self as any).registration.showNotification(title, {
        body,
        icon: image
      })
    })
  })
  .catch(/* error */)
