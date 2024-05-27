<script>
	import '../app.css';
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
	import UndrawDecide from '$lib/svg/UndrawDecide.svelte';
	import { goto } from '$app/navigation';

	let navInput = $state();
	let noticeSpecialChar = $state(false);
	let disabledButton = $state(false);
	let submittedSpinner = $state(false);
	const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
</script>

<div class="max-w-dvw flex flex-wrap items-center justify-center xl:min-h-dvh">
	<UndrawDecide />
	<div
		class="view-outline z-20 grid w-full max-w-5xl space-y-10 rounded-2xl border-2 border-primary bg-base-100 p-3 pt-4 shadow-lg lg:p-10"
	>
		<div>
			<h1 class="view-header text-primary"><a href="/">Appraize</a></h1>
			<p>Do your ranking session easily.</p>
		</div>
		<div>
			<div class="flex w-full gap-1">
				<input
					type="text"
					name="name"
					placeholder="Type a few letters or numbers here to begin"
					class="input input-bordered input-primary w-full"
					bind:value={navInput}
					oninput={() => {
						disabledButton = false;
					}}
				/>
				<button
					class="btn btn-primary text-xl font-bold"
					id="goButton"
					disabled={disabledButton}
					onclick={() => {
						if (!navInput) {
							disabledButton = true;
						} else if (regex.test(navInput)) {
							disabledButton = true;
							noticeSpecialChar = true;
						} else {
							submittedSpinner = true;
							goto(`/v/${navInput}`);
						}
					}}
					>{#if submittedSpinner}
						<span class="loading loading loading-spinner"></span>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.5em"
							height="1.5em"
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
						>{/if}
				</button>
			</div>
			{#if noticeSpecialChar === true}<span class="font-bold text-red-400">
					Please remove special characters and symbols!
				</span>{:else}&nbsp;{/if}
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
