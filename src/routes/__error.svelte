<script context="module">
export function load({ error, status }) {
  return {
    props: {
      title: `${status}: ${error.message}`,
      stack: error.stack
    }
  }
}
</script>

<script>
import { Report, Post } from '$lib/chat'

export let title
export let stack
</script>

<Report handle="WSAY"><h1>{title}</h1></Report>
<Post handle="WSAY">
  {stack}
</Post>
