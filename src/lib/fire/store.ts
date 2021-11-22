import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import type { User } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { writable } from 'svelte/store'

export const app = writable<FirebaseApp>()
export const user = writable<User>()
export const error = writable<Error>()

export function init(options: FirebaseOptions, name?: string) {
  const fireApp = initializeApp(options, name)
  app.set(fireApp)
}
