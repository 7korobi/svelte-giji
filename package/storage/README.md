```html
<script lang="ts">
  import { writeLocal, writeSession, writeHistory, Poll } from 'svelte-storage';

  const font = writeLocal('font', 'novel');

  function face(face_id: string) {
    return {
      version: '1.0.0',
      timer: '12h',
      shift: '1h10m',
      idx: `https://localhost/face/${face_id}`,
      onFetch(o) {
        console.log(o);
      }
    };
  }

  function setFont() {
    $font = 'gothic';
  }
</script>
<Poll {...face('c01')} />

<button on:click="{setFont}">hit to font change</button>
```
