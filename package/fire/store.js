import { initializeApp } from 'firebase/app';
import { writable } from 'svelte/store';
import { writeLocal } from 'svelte-storage';
export const topicsAck = writeLocal('fcmTopics', []);
export const topics = writeLocal('fcmTopicsReq', []);
export const token = writable();
export const app = writable();
export const user = writable();
export const error = writable();
export function init(options, name) {
  const fireApp = initializeApp(options, name);
  app.set(fireApp);
}
