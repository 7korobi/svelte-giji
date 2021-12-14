<script lang="ts" context="module">
import { dev } from '$app/env'
import { Folders } from '$lib/pubsub/map-reduce'
import chat from '$lib/chat'
import site from '$lib/site'

if (dev) {
  chat.sameSites.set(Array.from(Folders.data.sameSites))
  site.url.set({
    portrate: 'https://giji.f5.si/images/portrate/',
    icon: 'https://giji.f5.si/images/icon/',
    css: '/css/',
    api: 'https://giji-api.duckdns.org/api/',
    oldlog: 'https://s3-ap-northeast-1.amazonaws.com/giji-assets/',
    top: '/'
  })
} else {
  site.url.set({
    portrate: 'https://giji.f5.si/images/portrate/',
    icon: 'https://giji.f5.si/images/icon/',
    css: 'https://giji.f5.si/css/',
    api: 'https://giji-api.duckdns.org/api/',
    oldlog: 'https://s3-ap-northeast-1.amazonaws.com/giji-assets/',
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
