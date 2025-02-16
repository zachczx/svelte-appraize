<script lang="ts">
	import ErrorNaughtyDog from '$lib/svg/error-naughty-dog.svg?dataurl';
	import { useClerkContext } from 'svelte-clerk';
	import { CalculateDateAgo } from '$lib/utils';
	const ctx = useClerkContext();
	const userId = $derived(ctx.auth.userId);
	const user = $derived(ctx.user);
	let { data } = $props();
</script>

<main class="grid content-center justify-items-center">
	<h1 class="pb-8 font-extrabold">Your Sessions</h1>
	<div class="grid grid-cols-4 content-center justify-items-center gap-8 px-8">
		{#if data.streamed.result.length === 0}
			<div class="grid content-center justify-items-center gap-4">
				<img src={ErrorNaughtyDog} class="w-96 hue-rotate-[350deg]" alt="Under construction" />
				<h2>Oops, under construction!</h2>
			</div>
		{/if}
		{#each data.streamed.result as session}
			<a href="/session/{session.slug}" class="card w-full max-w-96 bg-base-100 shadow-xl">
				<div class="card-body">
					<h2>{session.title}</h2>
					<div class="text-base-content/70">
						{#if session.timestamp}
							<span>{CalculateDateAgo(session.timestamp)}</span>
						{/if}
						{#if session.count}
							<span class="flex gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1.3em"
									height="1.3em"
									class="tabler:user"
									viewBox="0 0 24 24"
									><path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
									/></svg
								>{session.count}
							</span>
						{/if}
					</div>
					<!-- <div class="card-actions justify-end">
					<button class="btn btn-primary">Buy Now</button>
				</div> -->
				</div>
			</a>
		{/each}
	</div>
</main>
