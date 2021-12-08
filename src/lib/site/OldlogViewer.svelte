<script lang="ts">
import type { STORY_ID } from '$lib/pubsub/map-reduce'
	import { oldlog, oldlog_stories, oldlog_events, oldlog_potofs, oldlog_messages } from '$lib/pubsub/poll'
	import { Erase } from '$lib/icon'
	import site from '$lib/site'
	import { Post, Report } from '$lib/chat'
	import Poll from '$lib/storage/Poll.svelte'
	import Sup from '../inline/Sup.svelte'
	import Btn from '../inline/Btn.svelte'
	import Grid from '../inline/Grid.svelte'
	import { Location } from '$lib/uri'
	import { default_story_query } from '$lib/pubsub/model-client'
	
	const { url } = site
	
	export let refresh: any = undefined
	export let hash = ''
	export let params = default_story_query()
	let drill = false

	$: folder_id = subid( params.idx, 1 )
	$: story_id = subid( params.idx, 2 ) as STORY_ID
	$: event_id = subid( params.idx, 3 )
	$: message_id = subid( params.idx, 5 )

	function subid(id: string, size: number) {
		const sub = id.split('-').slice(0,size)
		return sub.length === size ? sub.join('-') : null
	}

	</script>
	
	<Location {refresh} bind:hash bind:searchParams={params} />
	<Poll {...oldlog(story_id)} />
	
	<Post handle="btns form">
	</Post>
	
	<Report handle="btns form">
	</Report>
	
	<style lang="scss">
	</style>
	