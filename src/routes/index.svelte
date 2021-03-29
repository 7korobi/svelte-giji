<script lang="ts">
	import Counter from '$lib/Counter.svelte';
  import Chat from "svelte-petit-libs/src/chat/Chat.svelte"
  import Banner from "svelte-petit-libs/src/chat/Banner.svelte"

  import KeyBoard from "svelte-petit-libs/src/head/KeyBoard.svelte"
  import FullScreen from "svelte-petit-libs/src/head/FullScreen.svelte"
  import Btn from "svelte-petit-libs/src/inline/Btn.svelte"

  import { Bits } from "svelte-petit-libs/src/lib/bits"

  const GameBits = new Bits(["A", "B", "C", "D"], {
    AB: ["B", "A"],
    CD: ["C", "D"],
    BC: ["AB", "C"],
  })
  let games = 0

</script>

<main>
	<Banner>
		<h3>.1.1</h3>
	</Banner>
	<Chat show="report" handle="VSSAY">
		<p>
			on : +@ ~@
			{#each GameBits.labels as game (game)}
				<Btn type="on" bind:value={games} as={GameBits.posi[game]}>
					{game}
				</Btn>
			{/each}
			{#each GameBits.labels as game (game)}
				<Btn type="on" bind:value={games} as={GameBits.nega[game]}>
					{game}
				</Btn>
			{/each}
		</p>
		<p>
			off : +@ ~@
			{#each GameBits.labels as game (game)}
				<Btn type="off" bind:value={games} as={GameBits.posi[game]}>
					{game}
				</Btn>
			{/each}
			{#each GameBits.labels as game (game)}
				<Btn type="off" bind:value={games} as={GameBits.nega[game]}>
					{game}
				</Btn>
			{/each}
		</p>
		<p>
			xor : +@ ~@
			{#each GameBits.labels as game (game)}
				<Btn type="xor" bind:value={games} as={GameBits.posi[game]}>
					{game}
				</Btn>
			{/each}
			{#each GameBits.labels as game (game)}
				<Btn type="xor" bind:value={games} as={GameBits.nega[game]}>
					{game}
				</Btn>
			{/each}
		</p>
		<p>
			toggle : +@ ~@
			{#each GameBits.labels as game (game)}
				<Btn type="toggle" bind:value={games} as={GameBits.posi[game]}>
					{game}
				</Btn>
			{/each}
			{#each GameBits.labels as game (game)}
				<Btn type="toggle" bind:value={games} as={GameBits.nega[game]}>
					{game}
				</Btn>
			{/each}
		</p>
		<p>
			set : +@ ~@
			{#each GameBits.labels as game (game)}
				<Btn type="set" bind:value={games} as={GameBits.posi[game]}>
					{game}
				</Btn>
			{/each}
			{#each GameBits.labels as game (game)}
				<Btn type="set" bind:value={games} as={GameBits.nega[game]}>
					{game}
				</Btn>
			{/each}
		</p>
		<p>
			as : +@ ~@
			{#each GameBits.labels as game (game)}
				<Btn type="as" bind:value={games} as={GameBits.posi[game]}>
					{game}
				</Btn>
			{/each}
			{#each GameBits.labels as game (game)}
				<Btn type="as" bind:value={games} as={GameBits.nega[game]}>
					{game}
				</Btn>
			{/each}
		</p>
	</Chat>
</main>

<style lang="scss">
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
	}

	p {
		max-width: 14rem;
		margin: 2rem auto;
		line-height: 1.35;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}

		p {
			max-width: none;
		}
	}
</style>
