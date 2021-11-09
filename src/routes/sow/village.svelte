<script lang="ts">
import { Poll } from '$lib/fetch'
import { oldlogs } from '$lib/pubsub/poll'
</script>

<Poll {...oldlogs()} />
