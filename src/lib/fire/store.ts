import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import type { User } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { writable } from 'svelte/store'

export const app = writable<FirebaseApp>(undefined)
export const user = writable<User>(undefined)
export const error = writable<Error>(undefined)

export function init(options: FirebaseOptions, name?: string) {
  app.set(initializeApp(options, name))
}
