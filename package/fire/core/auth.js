import { writable } from 'svelte/store';
import { assertApp } from './helpers';
export function userStore(opts = { persist: null }) {
  const auth = assertApp('getAuth');
  if (!auth)
    return {
      subscribe() {
        return () => {};
      },
      auth: {}
    };
  const storageKey = 'firebase_user';
  const { persist } = opts;
  let cached = null;
  if (persist) cached = JSON.parse(opts.persist.getItem(storageKey));
  const { subscribe, set } = writable(cached, () => {
    const teardown = auth.onAuthStateChanged((u) => {
      set(u);
      persist && opts.persist.setItem(storageKey, JSON.stringify(u));
    });
    return () => teardown;
  });
  return {
    subscribe,
    auth
  };
}
