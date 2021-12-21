<script lang="ts" context="module">
import { dev } from '$app/env'
import { Folders } from '$lib/pubsub/map-reduce'
import chat from '$lib/chat'
import site from '$lib/site'
import pointer from '$lib/pointer'

if (dev) {
  const portrate = 'https://gijilog.web.app/images/portrate/'

  chat.sameSites.set([...Folders.data.sameSites])
  pointer.url.set({
    portrate
  })
  site.url.set({
    portrate,
    icon: 'https://gijilog.web.app/images/icon/',
    css: '/css/',
    oldlog: 'https://s3-ap-northeast-1.amazonaws.com/giji-assets/',
    top: '/'
  })
} else {
  const portrate = 'https://gijilog.web.app/images/portrate/'

  chat.sameSites.set([...Folders.data.sameSites])
  pointer.url.set({
    portrate
  })
  site.url.set({
    portrate,
    icon: 'https://gijilog.web.app/images/icon/',
    css: 'https://gijilog.web.app/css/',
    oldlog: 'https://s3-ap-northeast-1.amazonaws.com/giji-assets/',
    top: 'https://gijilog.web.app/'
  })
}

pointer.style.set({
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
