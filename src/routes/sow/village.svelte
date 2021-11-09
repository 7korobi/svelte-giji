<script lang="ts">
import Poll from '$lib/storage/Poll.svelte'
import { oldlogs } from '$lib/pubsub/poll'
</script>

<Poll {...oldlogs()} />
