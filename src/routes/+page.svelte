<script>
	import '../app.css';
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
	import { goto } from '$app/navigation';
	let navInput = $state();
</script>

<div class="max-w-dvw flex min-h-dvh items-center justify-center">
	<div
		class="view-outline grid w-full max-w-5xl space-y-10 rounded-2xl border border-primary p-10 shadow-md"
	>
		<div>
			<h1 class="view-header text-primary"><a href="/">Appraize</a></h1>
			<p>Do your yearly ranking session easily.</p>
		</div>

		<div class="flex w-full gap-1">
			<input
				type="text"
				name="name"
				placeholder="Type something to start or continue"
				class="input input-bordered input-primary w-full"
				bind:value={navInput}
				required
			/>
			<button
				class="btn btn-primary text-xl font-bold"
				onclick={() => {
					goto(`/v/${navInput}`);
				}}
				>Go <svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right inline"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path
						d="M13 18l6 -6"
					/><path d="M13 6l6 6" /></svg
				></button
			>
		</div>
	</div>
</div>

<style>
	/* 	* {
		border: 1px solid red;
	} */

	.view-header {
		view-transition-name: view-header;
	}

	.view-outline {
		view-transition-name: view-outline;
	}
</style>
