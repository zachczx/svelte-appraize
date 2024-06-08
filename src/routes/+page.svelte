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

<svelte:head>
	<title>Appraize | Work Ranking Sessions Made Easy</title>
</svelte:head>
<!-- <SuperDebug data={$form} /> -->
<!---->
<div class="max-w-dvw background flex min-h-dvh flex-wrap content-center justify-center">
	<div
		class="view-outline grid w-full max-w-5xl space-y-10 rounded-2xl border border-gray-300 bg-gradient-to-b from-base-100 to-gray-100 p-3 pt-4 shadow-lg lg:p-10"
	>
		<div>
			<div class="view-header text-7xl font-black text-primary">
				<a href="/">Appraize</a>
			</div>
			<p class="text-lg">Ranking sessions made easy.</p>
		</div>
		<div>
			<form method="POST" use:enhance>
				<div class="flex w-full">
					<label
						class="view-input input input-bordered input-primary relative flex w-full self-center rounded-full border-2 text-lg shadow"
						for="session"
					>
						<input
							type="text"
							name="session"
							placeholder="Create or continue a ranking session (e.g. cssranking2024)"
							bind:value={$form.session}
							class="view-input-button w-full"
							required
						/>

						<button
							class="view-input-button group absolute -top-0 right-1"
							id="goButton"
							onsubmit={() => {
								submittedSpinner = true;
							}}
						>
							{#if submittedSpinner}
								<span class="loading loading loading-spinner"></span>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="2.5em"
									height="2.5em"
									viewBox="0 0 24 24"
									class="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-right inline fill-primary group-hover:saturate-50"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
										d="M12 2l.324 .005a10 10 0 1 1 -.648 0l.324 -.005zm.613 5.21a1 1 0 0 0 -1.32 1.497l2.291 2.293h-5.584l-.117 .007a1 1 0 0 0 .117 1.993h5.584l-2.291 2.293l-.083 .094a1 1 0 0 0 1.497 1.32l4 -4l.073 -.082l.064 -.089l.062 -.113l.044 -.11l.03 -.112l.017 -.126l.003 -.075l-.007 -.118l-.029 -.148l-.035 -.105l-.054 -.113l-.071 -.111a1.008 1.008 0 0 0 -.097 -.112l-4 -4z"
									/></svg
								>
							{/if}
						</button>
					</label>
				</div>
			</form>
			<div class="flex flex-wrap px-2 pt-3 font-medium">
				{#if $errors.session}
					<span class="text-base text-red-400">{$errors.session}</span>
				{:else}
					<div class="text-sm">
						Use only <div class="tooltip tooltip-top inline cursor-pointer px-0" data-tip="A-Z, a-z">letters,</div>

						<div class="tooltip tooltip-top inline cursor-pointer px-0" data-tip="0-9">numbers,</div>

						<div class="tooltip tooltip-top inline cursor-pointer px-0" data-tip="- —">dashes.</div>
					</div>
				{/if}
			</div>
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

	.view-input {
		view-transition-name: view-input;
	}
	.view-outline {
		view-transition-name: view-outline;
	}
	.background {
		/* https://colorhunt.co/palette/610c9f940b92da0c81e95793 */
		background-image: linear-gradient(
			to right,
			#f5f5f5,
			#e2d6f1,
			#d9b5e5,
			#d891d2,
			#da68b5,
			#d154a7,
			#c83d9a,
			#be1f8c,
			#a72991,
			#903094,
			#773594,
			#5d3891
		);
	}
</style>
