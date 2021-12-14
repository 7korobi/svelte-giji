## Svelte Browser

```html
<script lang="ts">
  import store, { KeyCapture, Browser, Viewport } from 'svelte-browser'
  const { isActive, isOnline, isWatching, isKeypad, isPortrait, isLandscape, isZoom, keys, zoomScale, zoomPoint, viewPoint, safePoint, keypadSize, zoomSize, viewSize, safeSize } = store

  $: if ($isActive) ... // isOnline && isWatching
  $: if ($isOnline) ... // detect online
  $: if ($isWatching) ... // visible visibilityState
  $: if ($isKeypad) ... // soft keypad detect
  $: if ($isPortrait) ... // width < height
  $: if ($isLandscape) ... // height < width
  $: if ($isZoom) ... // 1.0 < zoomScale

  $: if ($zoomScale < 3.0) ...
  $: $keys[0] // keydown first key
  $: [zoom_left, zoom_top] = $zoomPoint
  $: [view_left, view_top] = $viewPoint
  $: [safe_left, safe_top] = $safePoint
  $: [zoom_width, zoom_height] = $zoomSize
  $: [view_width, view_height] = $viewSize
  $: [safe_width, safe_height] = $safeSize
  $: [keypad_width, keypad_height] = $keypadSize
</script>

<Browser ratio="{1.0}" isDefaultSafeArea="{true}" />
<Viewport min="{1.0}" max="{3.0}" />
<KeyCapture disabled="{false}"></KeyCapture>
```
