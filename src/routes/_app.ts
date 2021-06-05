import { url, style } from '$lib/site/store'

url.set({
  portrate: 'https://giji.f5.si/images/portrate/',
  css: 'https://giji.f5.si/css/',
  api: 'https://giji-api.duckdns.org/api/'
})

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
