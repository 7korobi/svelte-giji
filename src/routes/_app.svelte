<script lang="ts" context="module">
import { dev } from '$app/env'
import { url, style } from '$lib/site/store'

if (dev) {
  url.set({
    portrate: '/images/portrate/',
    css: '/css/',
    api: 'https://giji-api.duckdns.org/api/',
    top: '/'
  })
} else {
  url.set({
    portrate: 'https://giji.f5.si/images/portrate/',
    css: 'https://giji.f5.si/css/',
    api: 'https://giji-api.duckdns.org/api/',
    top: 'https://giji.f5.si/'
  })
}

style.set({
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
