## Svelte GIJI Browser Device

```typescript
import { isPC, isTablet, isMobile, isBlink, isMacSafari, isIOSlegacy, isLegacy } from 'svelte-giji-browser-device'

if (isTablet) ... // device type Tablet
if (isMobile) ... // device type Mobile
if (isPC) ... // not Tablet / Mobile / Android / IOS
if (isBlink) ... // blink browser
if (isMacSafari) ... // webkit browser && Mac OS
if (isIOSlegacy) ... // IOS && legacy
if (isLegacy) ... // not support VisualViewport / ResizeObaserver / IntersectionObserver

```
