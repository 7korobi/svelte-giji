<script lang="ts">
import { createEditor } from './editorjs-wrapper'

const { editor, data, isReady } = createEditor()

$: if ($data) {
  console.log($data)
}
</script>

<div
  use:editor={{
    placeholder: '心を込めて！',
    hideToolbar: false
  }} />
