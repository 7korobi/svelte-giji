<script lang="ts">
import { __BROWSER__ } from '$lib/browser'
import { Post } from '$lib/chat'
import { BreadCrumb } from '$lib/topic'

import './_app.svelte'
</script>

<Post handle="SSAY">
  <h1>Welcome to SvelteKit</h1>
  <p>Visit <a sveltekit:prefetch href="/demo">DEMO</a></p>
</Post>

<style lang="scss">
</style>
