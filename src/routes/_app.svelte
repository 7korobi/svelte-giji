<script lang="ts" context="module">
import { dev } from '$app/env'
import { site } from '$lib/store'

import client from '$lib/db/socket.io-client'
import * as stores from '../pubsub/store'

if (dev) {
  client('ws://localhost:3001', stores)

  site.url.set({
    portrate: 'https://giji.f5.si/images/portrate/',
    css: '/css/',
    api: 'https://giji-api.duckdns.org/api/',
    top: '/'
  })
} else {
  client('ws://localhost:3001', stores)

  site.url.set({
    portrate: 'https://giji.f5.si/images/portrate/',
    css: 'https://giji.f5.si/css/',
    api: 'https://giji-api.duckdns.org/api/',
    top: 'https://giji.f5.si/'
  })
}

site.style.set({
  icon: {
    width: 90,
    height: 130
  },
  gap_size: 50,
  line_slide: 25,
  border_width: 5,
  rx: 10,
  ry: 10
})
</script>

<style lang="scss">
</style>
