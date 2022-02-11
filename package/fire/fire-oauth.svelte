<script context="module">
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithRedirect,
  TwitterAuthProvider,
  getAuth,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { app, user, error } from './store';
app.subscribe(initOAuth);
let auth;
function initOAuth($app) {
  if (!$app) return;
  if (!__BROWSER__) return;
  console.log($app);
  auth = getAuth($app);
  onAuthStateChanged(auth, user.set, error.set);
}
</script>

<script>
import { __BROWSER__ } from 'svelte-petit-utils';
import { Facebook, Twitter, Windows, Google, Github, Logout } from '../icon';
$: if ($user) console.log($user);
$: if ($error) console.log($error);
function icon({ providerData: [{ providerId }] }) {
  switch (providerId) {
    case 'twitter.com':
      return Twitter;
    case 'facebook.com':
      return Facebook;
    case 'google.com':
      return Google;
    case 'github.com':
      return Github;
    case 'microsoft.com':
      return Windows;
    default:
      return null;
  }
}
</script>

{#if $user}
  <button class="pull-right" on:click={() => signOut(auth)}><Logout /></button>
  <svelte:component this={icon($user)} />
  <span class="tap">{$user.displayName}</span>
{:else}
  <button on:click={() => signInWithRedirect(auth, new FacebookAuthProvider())}><Facebook /></button>
  <button on:click={() => signInWithRedirect(auth, new TwitterAuthProvider())}><Twitter /></button>
  <button on:click={() => signInWithRedirect(auth, new OAuthProvider('microsoft.com'))}><Windows /></button>
  <button on:click={() => signInWithRedirect(auth, new GoogleAuthProvider())}><Google /></button>
  <button on:click={() => signInWithRedirect(auth, new GithubAuthProvider())}><Github /></button>
{/if}
