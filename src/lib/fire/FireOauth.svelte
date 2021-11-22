<script type="ts">
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithRedirect,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  GithubAuthProvider,
  User
} from 'firebase/auth'

import { __BROWSER__ } from '$lib/browser/device'
import { Facebook, Twitter, Windows, Google, Github, Logout } from '$lib/icon'
import { app, user, error } from './store'

const auth = __BROWSER__ ? getAuth($app) : undefined
$: if ($user) console.log($user)
$: if ($error) console.log($error)

if (__BROWSER__) {
  onAuthStateChanged(auth, user.set, error.set)
}

function icon({ providerData: [{ providerId }] }: User) {
  switch (providerId) {
    case 'twitter.com':
      return Twitter
    case 'facebook.com':
      return Facebook
    case 'google.com':
      return Google
    case 'github.com':
      return Github
    case 'microsoft.com':
      return Windows
    default:
      return null
  }
}
</script>

{#if $user}
  <button class="pull-right" on:click={() => signOut(auth)}><Logout /></button>
  <svelte:component this={icon($user)} />
  <span class="tap">{$user.displayName}</span>
{:else}
  <button on:click={() => signInWithRedirect(auth, new FacebookAuthProvider())}><Facebook /></button
  >
  <button on:click={() => signInWithRedirect(auth, new TwitterAuthProvider())}><Twitter /></button>
  <button on:click={() => signInWithRedirect(auth, new OAuthProvider('microsoft.com'))}
    ><Windows /></button
  >
  <button on:click={() => signInWithRedirect(auth, new GoogleAuthProvider())}><Google /></button>
  <button on:click={() => signInWithRedirect(auth, new GithubAuthProvider())}><Github /></button>
{/if}
