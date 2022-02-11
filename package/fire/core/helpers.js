import { getContext } from 'svelte';
// Validates end-user has setup context and imported proper modules into the Svelte app
export function assertApp(key) {
  const get = getContext('firebase');
  if (!get) {
    throw new Error(`Missing Firebase app in context. Are you inside a 'FirebaseApp' component?`);
  }
  const firebase = get.getApp();
  if (!firebase) return null;
  if (!key) return firebase;
  const pkg = get[key] && get[key](firebase);
  if (!pkg) throw new Error(`Firebase ${key} not found. You may be missing "import 'firebase/${key}'" `);
  return pkg;
}
