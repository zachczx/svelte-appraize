<script>
	import '../app.css';
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
	import UndrawDecide from '$lib/svg/UndrawDecide.svelte';
	import { goto } from '$app/navigation';
	import { editFormSubmitKeyboardShortcut } from '$lib/FormSubmitKeyboardShortcut';
	import { superForm } from 'sveltekit-superforms';

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

<div class="bg-base-200 flex min-h-dvh max-w-dvw flex-wrap content-center justify-center px-2">
	<div class="view-outline grid w-full max-w-5xl space-y-10 rounded-2xl p-3 pt-4 backdrop-blur-2xl lg:p-10">
		<div class="text-center">
			<div class="view-header text-primary text-7xl font-black">
				<a href="/">Appraize</a>
			</div>
			<p class="mt-2 text-lg">Ranking sessions made easier.</p>
		</div>
		<div>
			<form method="POST" id="landing-input" use:enhance>
				<div class="flex w-full justify-center">
					<label
						class="input input-xl shadow-primary/30 focus-within:shadow-primary/30 focus-within:outline-primary/30 relative flex w-full max-w-160 self-center rounded-full border-2 ps-6 text-lg shadow-lg focus-within:border-transparent focus-within:shadow-lg"
						for="session"
					>
						<input
							type="text"
							name="session"
							placeholder="Create or continue session (eg. cs24)"
							bind:value={$form.session}
							class="view-input-button w-full"
							autocomplete="off"
							onkeydown={(evt) => {
								editFormSubmitKeyboardShortcut(evt, 'landing-input');
								if (evt.key === 'Enter' && $form.session.length > 0) {
									submittedSpinner = true;
								}
							}}
							required
						/>

						<button
							class="view-input-button group absolute -top-0 right-1"
							id="goButton"
							onsubmit={() => {
								if ($form.session.length > 0) {
									submittedSpinner = true;
								}
							}}
							onclick={() => {
								if ($form.session.length > 0) {
									submittedSpinner = true;
								}
							}}
						>
							{#if submittedSpinner}
								<div class="dot me-1 mt-1 flex items-center justify-center">
									<span class="loading loading-spinner loading-md text-base-100 self-center"></span>
								</div>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1em"
									height="1em"
									viewBox="0 0 24 24"
									class="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-right fill-primary inline size-13 group-hover:brightness-[0.7]"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
										d="M12 2l.324 .005a10 10 0 1 1 -.648 0l.324 -.005zm.613 5.21a1 1 0 0 0 -1.32 1.497l2.291 2.293h-5.584l-.117 .007a1 1 0 0 0 .117 1.993h5.584l-2.291 2.293l-.083 .094a1 1 0 0 0 1.497 1.32l4 -4l.073 -.082l.064 -.089l.062 -.113l.044 -.11l.03 -.112l.017 -.126l.003 -.075l-.007 -.118l-.029 -.148l-.035 -.105l-.054 -.113l-.071 -.111a1.008 1.008 0 0 0 -.097 -.112l-4 -4z"
									/></svg
								>
							{/if}
						</button>
					</label>
				</div>
			</form>
			<div class="flex flex-wrap justify-center px-2 pt-3 font-medium">
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

	.dot {
		height: 2em;
		width: 2em;
		background-color: #640d6b;
		border-radius: 50%;
	}
</style>
