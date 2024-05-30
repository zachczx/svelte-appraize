<script>
	import '../app.css';
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
	import UndrawDecide from '$lib/svg/UndrawDecide.svelte';
	import { goto } from '$app/navigation';

	//superforms imports
	import { superForm } from 'sveltekit-superforms';
	//import SuperDebug from 'sveltekit-superforms';
	let { data } = $props();

	// superforms Client API:
	const { form, errors, enhance, constraints, message } = superForm(data.form);

	let submittedSpinner = $state(false);
	const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
</script>

<!-- <SuperDebug data={$form} /> -->
<div class="max-w-dvw flex min-h-dvh flex-wrap content-center justify-center">
	<UndrawDecide />
	<div
		class="view-outline z-20 grid w-full max-w-5xl space-y-10 rounded-2xl border-2 border-primary bg-base-100 p-3 pt-4 shadow-lg lg:p-10"
	>
		<div>
			<h1 class="view-header text-primary"><a href="/">Appraize</a></h1>
			<p>Do your ranking session easily.</p>
		</div>
		<div>
			<form method="POST" use:enhance>
				<div class="flex w-full gap-1">
					<label for="session"></label>
					<input
						type="text"
						name="session"
						placeholder="Type a few letters or numbers here to begin"
						class="input input-bordered input-primary w-full"
						bind:value={$form.session}
						required
					/>
					<button class="btn btn-primary text-xl font-bold" id="goButton">
						{#if submittedSpinner}
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
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" />
								<path d="M13 18l6 -6" /><path d="M13 6l6 6" />
							</svg>{/if}
					</button>
				</div>
				<div class="invalid px-2 pt-1 text-base font-medium text-red-400">
					{#if $errors.session}
						{$errors.session}
					{:else}
						&nbsp;
					{/if}
				</div>
			</form>
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
