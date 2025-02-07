<script>
	import { editFormSubmitKeyboardShortcut } from '$lib/FormSubmitKeyboardShortcut';
	import SmallScreenHamburger from '$lib/SmallScreenHamburger.svelte';
	import { enhance } from '$app/forms';

	let searchInput = $state();
	let submittedSpinner = $state(false);
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
	<div
		class="col-span-1 flex items-center border-b-2 border-base-300 bg-base-200 py-4 text-2xl lg:border-r-2 lg:pe-4 lg:ps-5"
	>
		<SmallScreenHamburger />
		<h1 class="view-header text-6xl font-black text-primary">
			<a href="/">Appraize</a>
		</h1>
	</div>
	<div class="col-span-1 hidden items-center border-b-2 border-b-base-300/10 px-2 pe-10 md:flex lg:col-span-3 lg:px-8">
		<form method="POST" id="view-top-navbar-input" action="?/redirect" class="flex w-full justify-center" use:enhance>
			<label
				class="view-top-navbar-input input input-bordered input-primary relative flex w-full max-w-[30rem] self-center rounded-full border-gray-400 text-lg"
				for="session"
			>
				<input
					type="text"
					name="session"
					bind:value={searchInput}
					placeholder="Jump to another session"
					class="w-full"
					onkeydown={(evt) => {
						editFormSubmitKeyboardShortcut(evt, 'view-top-navbar-input');
					}}
					required
				/>
				<button class="view-input-button group absolute -top-0 right-1">
					{#if submittedSpinner && searchInput.length > 0}
						<span class="loading loading-spinner"></span>
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
						>{/if}
				</button>
			</label>
		</form>
	</div>
	<slot />
</div>

<style>
	.view-header {
		view-transition-name: view-header;
	}
	.view-top-navbar-input {
		view-transition-name: view-top-navbar-input;
	}

	.view-outline {
		view-transition-name: view-outline;
	}
	.view-footer {
		view-transition-name: view-footer;
	}
</style>
