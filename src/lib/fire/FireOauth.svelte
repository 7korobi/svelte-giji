<script type="ts">
import { onMount, onDestroy, createEventDispatcher } from 'svelte'
import firebase from 'firebase/app'

let user: firebase.User
let uc: firebase.auth.UserCredential
let error: any
let icon = 'btn'

$: uc && setIcon(uc.credential.providerId)

const auth = firebase.auth()

auth.onIdTokenChanged(setUser)

auth.onAuthStateChanged(setUser)

auth
  .getRedirectResult()
  .catch(setError)
  .then((userCredential) => {
    if (userCredential) {
      uc = userCredential
      user = uc.user
    } else {
      user = uc = undefined
    }
  })

auth
  .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch(setError)
  .then(() => {
    console.log('session persistence')
  })

function setIcon(providerId) {
  switch (providerId) {
    case 'twitter.com':
      return (icon = 'btn mdi mdi-twitter')
    case 'facebook.com':
      return (icon = 'btn mdi mdi-facebook-box')
    case 'microsoft.com':
      return (icon = 'btn mdi mdi-microsoft-windows')
    case 'google.com':
      return (icon = 'btn mdi mdi-google')
    case 'github.com':
      return (icon = 'btn mdi mdi-github-face')
  }
}

function setError(e) {
  error = e
}

function setUser(o: firebase.User) {
  user = o
}

function signOut() {
  user = uc = undefined
  auth.signOut()
}

function facebook() {
  auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider())
}
function twitter() {
  auth.signInWithRedirect(new firebase.auth.TwitterAuthProvider())
}
function github() {
  auth.signInWithRedirect(new firebase.auth.GithubAuthProvider())
}
function google() {
  auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
}
function microsoft() {
  auth.signInWithRedirect(new firebase.auth.OAuthProvider('microsoft.com'))
}
</script>

{#if user}
  <span class="tap pull-right"><i class="btn mdi mdi-logout" on:click={signOut} /></span>
  <span class="tap"><i class={icon}> &thinsp; {user.displayName}</i></span>
{:else}
  <span class="tap"><i class="btn mdi mdi-facebook-box" on:click={facebook} /></span>
  <span class="tap"><i class="btn mdi mdi-twitter" on:click={twitter} /></span>
  <span class="tap"><i class="btn mdi mdi-windows" on:click={microsoft} /></span>
  <span class="tap"><i class="btn mdi mdi-google" on:click={google} /></span>
  <span class="tap"><i class="btn mdi mdi-github-face" on:click={github} /></span>
{/if}

{#if error}<br /> {error.code} {error.message}{/if}
