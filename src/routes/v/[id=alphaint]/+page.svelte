<script lang="ts">
	import { enhance } from '$app/forms';
	import Trash from '$lib/svg/Trash.svelte';
	import { slide } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import Home from '$lib/svg/Home.svelte';
	import { editFormSubmitKeyboardShortcut } from '$lib/FormSubmitKeyboardShortcut';
	import SmallScreenHamburger from '$lib/SmallScreenHamburger.svelte';
	import Papa from 'papaparse';

	import DragDrop from '$lib/DragDrop.svelte';
	import Chart from '$lib/Chart.svelte';

	let { data, form } = $props();

	let formSaveSession = $state();
	let formAutoSaveSession: HTMLFormElement = $state();
	let formSaveSuccessLoading = $state(false);
	let autoSave = $state(true);
	let nameData = $state();
	let deptData = $state();
	let gradeData = $state();
	let remarksData = $state();

	let deleteSessionButtonClickedSpinner = $state(false);

	/**
	 * @type {HTMLFormElement} filterform - form element for filter bar
	 */
	let filterForm: HTMLFormElement;
	let filterInput = $state();
	let filterGradeValue = $state('Grade');

	let order = $state(data.streamed.sequence);

	let uploadPreview = $state(false);
	let outsideVar = $state();
	let formUploadButtonSpinner = $state(false);

	let newCounts = $derived.by(async () => {
		let newCounts = {
			a: 0,
			b: 0,
			cPlus: 0,
			c: 0,
			cMinus: 0,
			cTotal: 0,
			d: 0,
			total: 0,
			percentageA: 0,
			percentageB: 0,
			percentageC: 0,
			percentageD: 0,
		};
		let tempResult = await data.streamed.result;

		for (let i = 0; i < tempResult.length; i++) {
			if (tempResult[i].grade === 'A') {
				newCounts.a += 1;
			} else if (tempResult[i].grade === 'B') {
				newCounts.b += 1;
			} else if (tempResult[i].grade === 'C+') {
				newCounts.cPlus += 1;
			} else if (tempResult[i].grade === 'C') {
				newCounts.c += 1;
			} else if (tempResult[i].grade === 'C-') {
				newCounts.cMinus += 1;
			} else if (tempResult[i].grade === 'D') {
				newCounts.d += 1;
			}
		}
		newCounts.cTotal = newCounts.cPlus + newCounts.c + newCounts.cMinus;
		newCounts.total = newCounts.a + newCounts.b + newCounts.cTotal + newCounts.d;
		// console.log(newCounts);
		if (newCounts.total == 0 || !newCounts.total) {
			newCounts.percentageA = newCounts.percentageB = newCounts.cTotal = newCounts.percentageD = 0;
		} else {
			newCounts.percentageA = Math.round((newCounts.a / newCounts.total) * 100);
			newCounts.percentageB = Math.round((newCounts.b / newCounts.total) * 100);
			newCounts.percentageC = Math.round((newCounts.cTotal / newCounts.total) * 100);
			newCounts.percentageD = Math.round((newCounts.d / newCounts.total) * 100);
		}
		return newCounts;
	});

	$effect(() => {
		setInterval(() => {
			if (formAutoSaveSession) {
				if (autoSave) {
					formAutoSaveSession.requestSubmit();
					console.log('Auto saved successfully');
					formSaveSuccessLoading = true;
					setTimeout(() => {
						formSaveSuccessLoading = false;
					}, 1500);
				}
			}
		}, 180000);
	});

	let deleteSessionModal: HTMLDialogElement;
	let uploadModal: HTMLDialogElement;

	let searchInput: string = $state('');
	let submittedSpinner = $state(false);
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
	<div class="col-span-1 grid grid-cols-[auto_1fr] border-b-2 border-base-300 bg-base-200 text-2xl lg:border-r-2">
		<!-- <SmallScreenHamburger /> -->

		<div class="view-outline hidden bg-base-200 text-2xl text-base-content/70 lg:grid">
			<div
				class="m-1 grid w-full max-w-24 content-start justify-items-center gap-4 rounded-lg border-2 border-black/10 bg-base-300 px-4 py-4 text-base-content/70"
			>
				<h1 class="view-header px-2 py-1 text-6xl font-black text-primary">
					<a href="/">A</a>
				</h1>
				<a
					href="/"
					aria-label="Home"
					class="mt-4 flex h-12 w-12 items-center justify-center rounded-xl text-4xl hover:bg-primary hover:text-primary-content"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="icon icon-tabler icons-tabler-outline icon-tabler-home"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M5 12l-2 0l9 -9l9 9l-2 0" />
						<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
						<path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
					</svg></a
				>

				<a
					href="/"
					aria-label="Dashboard"
					class="flex h-12 w-12 items-center justify-center rounded-xl text-4xl hover:bg-primary hover:text-primary-content"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						class="tabler:layout-dashboard"
						viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1m0 12h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1m10-4h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1m0-8h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1"
						/>
					</svg></a
				>
				<a
					href="/"
					aria-label="Help"
					class="flex h-12 w-12 items-center justify-center rounded-xl text-4xl hover:bg-primary hover:text-primary-content"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="tabler:help" viewBox="0 0 24 24"
						><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9 5v.01" /><path
								d="M12 13.5a1.5 1.5 0 0 1 1-1.5a2.6 2.6 0 1 0-3-4"
							/></g
						></svg
					>
				</a>
				<a
					href="https://zixianchen.com/contact"
					aria-label="Contact"
					class="flex h-12 w-12 items-center justify-center rounded-xl text-4xl hover:bg-primary hover:text-primary-content"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="tabler:mail" viewBox="0 0 24 24"
						><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path
								d="m3 7l9 6l9-6"
							/></g
						></svg
					>
				</a>
			</div>
		</div>

		<!-- Sidebar -->

		<div class="view-home-sidebar grid content-start gap-8 px-8 pb-4 pt-8">
			<h3 class="text-3xl font-extrabold text-base-content/85">Session Controls</h3>
			<div class="hidden items-center border-b-2 border-b-base-300/10 md:flex">
				<form
					method="POST"
					id="view-top-navbar-input"
					action="?/redirect"
					class="flex w-full justify-center"
					use:enhance
				>
					<label
						class="view-top-navbar-input input input-bordered input-primary relative flex w-full max-w-[30rem] items-center self-center rounded-full border-gray-400"
						for="session"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.3em"
							height="1.3em"
							class="tabler:player-track-next-filled me-4 text-base-content/30"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M2 5v14c0 .86 1.012 1.318 1.659.753l8-7a1 1 0 0 0 0-1.506l-8-7C3.012 3.682 2 4.141 2 5m11 0v14c0 .86 1.012 1.318 1.659.753l8-7a1 1 0 0 0 0-1.506l-8-7C14.012 3.682 13 4.141 13 5"
							/></svg
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
						<button class="view-input-button -me-3 ms-2">
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
			<div class="grid content-start gap-y-12">
				<div class="view-add-sidebar grid gap-4">
					<h3 class="flex items-center gap-4 font-extrabold text-base-content/70">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.3em"
							height="1.3em"
							class="tabler:playlist-add"
							viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 8H5m0 4h9m-3 4H5m10 0h6m-3-3v6"
							/></svg
						>Add Officer
					</h3>

					<form method="POST" id="insert-form" action="?/insert" class="grid gap-y-1" use:enhance>
						{#if form?.insertNameMissing}<span class="text-error">Please enter a name:</span>{/if}
						<label class="input input-bordered input-primary flex w-full items-center border border-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus me-2 flex-none"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
								<path d="M16 19h6" />
								<path d="M19 16v6" />
								<path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
							</svg>
							<input
								type="text"
								name="name"
								bind:value={nameData}
								class="shrink"
								placeholder="Name"
								onkeydown={(evt) => {
									editFormSubmitKeyboardShortcut(evt, 'insert-form');
								}}
								required
							/>
						</label>
						{#if form?.insertDeptMissing}<span class="text-error">Please enter a dept:</span>{/if}
						<label class="border-1 input input-bordered input-primary flex w-full items-center border-gray-400">
							<Home class="me-2 flex-none stroke-base-content/70" />
							<input
								type="text"
								name="dept"
								bind:value={deptData}
								class="grow"
								placeholder="Dept"
								onkeydown={(evt) => {
									editFormSubmitKeyboardShortcut(evt, 'insert-form');
								}}
								required
							/>
						</label>
						{#if form?.insertGradeMissing}
							<span class="text-error">Please select a grade:</span>{/if}
						<div class="flex flex-wrap items-center justify-start">
							<label class="label me-2 cursor-pointer space-x-1">
								<span class="label-text font-medium text-base-content/70">A</span>
								<input
									type="radio"
									name="grade"
									value="A"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									bind:group={gradeData}
								/>
							</label>
							<label class="label me-2 cursor-pointer space-x-1">
								<span class="label-text font-medium text-base-content/70">B</span>
								<input
									type="radio"
									name="grade"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									value="B"
									bind:group={gradeData}
								/>
							</label>
							<label class="label me-2 cursor-pointer space-x-1">
								<span class="label-text font-medium text-base-content/70">C+</span>
								<input
									type="radio"
									name="grade"
									value="C+"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									bind:group={gradeData}
								/>
							</label>
							<label class="label me-2 cursor-pointer space-x-1">
								<span class="label-text font-medium text-base-content/70">C</span>
								<input
									type="radio"
									name="grade"
									value="C"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									bind:group={gradeData}
								/>
							</label>
							<label class="label me-2 cursor-pointer space-x-1">
								<span class="label-text font-medium text-base-content/70">C-</span>
								<input
									type="radio"
									name="grade"
									value="C-"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									bind:group={gradeData}
								/>
							</label>
							<label class="label me-2 cursor-pointer space-x-1">
								<span class="label-text font-medium text-base-content/70">D</span>
								<input
									type="radio"
									value="D"
									name="grade"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									bind:group={gradeData}
								/>
							</label>
						</div>

						<label class="input input-bordered input-primary flex w-full items-center border border-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-message me-2 flex-none"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M8 9h8" />
								<path d="M8 13h6" />
								<path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
							</svg>

							<input
								type="text"
								name="remarks"
								bind:value={remarksData}
								class="grow"
								placeholder="Remarks (Optional)"
								onkeydown={(evt) => {
									editFormSubmitKeyboardShortcut(evt, 'insert-form');
								}}
							/>
						</label>
						<button class="btn btn-primary relative w-full text-xl font-bold text-primary-content"
							>Add<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1.2em"
								height="1.2em"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right inline"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M5 12l14 0" />
								<path d="M13 18l6 -6" />
								<path d="M13 6l6 6" />
							</svg>
						</button>
					</form>
				</div>

				<!-- 
			/////////////////////////////////////////
			/
			/
			/
			/
			/	Upload
			/
			/
			/	
			/
			///////////////////////////////////////// 
			-->
				<div class="view-upload-sidebar grid gap-4">
					<h3 class="flex items-center gap-4 font-extrabold text-base-content/70">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.2em"
							height="1.2em"
							class="tabler:table-plus"
							viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7.5M3 10h18M10 3v18m6-2h6m-3-3v6"
							/></svg
						>Add Multiple
					</h3>

					<ul class="ms-1 space-y-2 border-l-4 border-l-base-300 ps-8 text-lg font-medium text-base-content/70">
						<li>
							<button
								onclick={() => {
									uploadModal.showModal();
								}}
							>
								Upload from file (.csv)</button
							>
						</li>
					</ul>
				</div>
				<!-- 
			/////////////////////////////////////////
			/
			/
			/
			/
			/	Manage Session
			/
			/
			/	
			/
			///////////////////////////////////////// 
			-->
				<div class="view-manage-sidebar grid gap-4">
					<h3 class="flex items-center gap-4 font-extrabold text-base-content/70">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.3em"
							height="1.3em"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path
								d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
							/>
							<path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
						</svg>Manage Session
					</h3>
					<ul class="ms-1 space-y-2 border-l-4 border-l-base-300 ps-8 text-lg font-medium text-base-content/70">
						<li>
							<form method="POST" action="?/save" bind:this={formSaveSession}>
								<button
									class="flex items-center gap-4 hover:text-primary"
									onclick={() => {
										formSaveSuccessLoading = true;
										setTimeout(() => {
											formSaveSuccessLoading = false;
										}, 1500);
									}}
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.3em"
										height="1.3em"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy motion-safe:animate-wiggle"
									>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
										<path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
										<path d="M14 4l0 4l-6 0l0 -4" />
									</svg>Save{#if formSaveSuccessLoading}
										<span class="loading-primary loading loading-spinner loading-sm ms-2"></span>
									{/if}
								</button>
								<input type="hidden" name="order" bind:value={order} />
							</form>
						</li>
						<li>
							<button
								class="flex items-center gap-4 hover:text-error"
								onclick={() => {
									deleteSessionModal.showModal();
								}}
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="1.3em"
									height="1.3em"
									class="tabler:trash"
									viewBox="0 0 24 24"
									><path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
									/></svg
								>Delete
							</button>
						</li>
						<li>
							<div class="flex items-center gap-4">
								<input
									type="checkbox"
									id="auto-save-checkbox"
									class="checkbox-primary checkbox checkbox-sm"
									bind:checked={autoSave}
								/>
								<label for="auto-save-checkbox" class="font-medium">Auto save every 3 mins</label>

								<form method="POST" action="?/save" bind:this={formAutoSaveSession} use:enhance>
									<!-- <button class="hidden"></button> -->
									<input type="hidden" name="order" bind:value={order} />
								</form>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="view-footer pt-16 text-base">© 2024 Zixian Chen.</div>
		</div>
	</div>
	<!-- 
	/////////////////////////////////////////
	/
	/
	/
	/
	/	Content 
	/
	/
	/	
	/
	///////////////////////////////////////// 
	-->
	<div class="col-span-2 min-h-dvh px-12 pb-4 pt-8 lg:pt-8">
		<ol class="view-content space-y-4">
			<div class="view-ranking-title px-4 pb-4 md:px-10">
				<h1>Ranking: {data.id}</h1>
				<div class="flex gap-4 pt-8">
					<form
						method="POST"
						action="?/filter"
						id="filter-input"
						bind:this={filterForm}
						class="join flex rounded-lg"
						use:enhance
					>
						<label
							class="input input-sm join-item input-bordered input-primary flex max-w-44 items-center border-gray-400 lg:max-w-full"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-filter me-2 inline text-base-content/60"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path
									d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"
								/>
							</svg>
							<input type="text" bind:value={filterInput} name="filter" class="lg:grow" placeholder="Keywords" />
						</label>
						<select
							id="filter-grade"
							name="grade"
							class="join-item select select-bordered select-primary select-sm border-gray-400"
							bind:value={filterGradeValue}
							onchange={() => {
								filterForm.requestSubmit();
							}}
						>
							<option disabled selected>Grade</option>
							<option value="A">A</option>
							<option value="B">B</option>
							<option value="C+">C+</option>
							<option value="C">C</option>
							<option value="C-">C-</option>
							<option value="D">D</option>
							<option value="All">All</option>
						</select>
						<button class="btn btn-primary join-item btn-sm font-bold text-base-100">Filter</button>
					</form>
					<button
						class="inline-block self-center"
						onclick={() => {
							filterInput = '';
							filterGradeValue = 'Grade';
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon icon-tabler icons-tabler-outline icon-tabler-refresh mb-1 me-2 inline"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
							<path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
						</svg><span class="hidden lg:inline">Reset</span>
					</button>
				</div>
			</div>
			{#key data.streamed.result}
				<DragDrop streamedResult={data.streamed.result} bind:value={order} />
			{/key}
		</ol>
	</div>

	<div class="grid content-start gap-4 border-l-2 border-l-base-300/30 bg-base-200 px-8">
		<h3 class="justify-self-start pt-8 text-3xl font-extrabold text-base-content/85">Details</h3>
		<div class="view-home-info grid content-start justify-items-center gap-y-4">
			<h3 class="flex items-center gap-4 justify-self-start pt-8 font-extrabold text-base-content/70">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1.3em"
					height="1.3em"
					class="tabler:info-circle"
					viewBox="0 0 24 24"
					><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m9-3h.01" /><path d="M11 12h1v4h1" /></g
					></svg
				>Properties
			</h3>
			<div class="grid content-start justify-items-center gap-y-4"></div>
		</div>
		<div class="view-summary-sidebar grid content-start justify-items-center">
			<h3 class="flex items-center gap-4 justify-self-start pt-8 font-extrabold text-base-content/70">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1.3em"
					height="1.3em"
					class="tabler:chart-pie-3"
					viewBox="0 0 24 24"
					><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						><path d="m12 12l-6.5 5.5M12 3v9h9" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0" /></g
					></svg
				>Grade Distribution
			</h3>
			{#await newCounts}
				<span class="loading loading-spinner my-8 text-primary"></span>
			{:then newCounts}
				<div class="justify-items-around grid w-full grid-cols-3 gap-2 pt-8 min-[1921px]:grid-cols-5">
					<div
						class="row-span-2 animate-scale content-center p-4 text-5xl font-black text-base-content/80 min-[1921px]:row-span-1"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon icon-tabler icons-tabler-outline icon-tabler-users text-3xl"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"
							/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path
								d="M21 21v-2a4 4 0 0 0 -3 -3.85"
							/></svg
						>{newCounts.total}
					</div>

					<div class="grid content-center justify-items-center rounded-xl bg-[#FED049] px-4 py-2">
						<div class="font-medium">A</div>
						<div class="flex animate-scale items-center justify-center text-3xl font-black text-base-content/80">
							{newCounts.a}
						</div>
					</div>
					<div class="grid content-center justify-items-center rounded-xl bg-[#808836]/60 px-4 py-2">
						<div class="font-medium">B</div>
						<div class="flex animate-scale items-center justify-center text-3xl font-black text-base-content/80">
							{newCounts.b}
						</div>
					</div>
					<div class="grid content-center justify-items-center rounded-xl bg-[#FF9A00] px-4 py-2">
						<div class="font-medium">C</div>
						<div class="flex animate-scale items-center justify-center text-3xl font-black text-base-content/80">
							{newCounts.c}
						</div>
					</div>
					<div class="grid content-center justify-items-center rounded-xl bg-[#D10363]/60 px-4 py-2">
						<div class="font-medium">D</div>
						<div class="flex animate-scale items-center justify-center text-3xl font-black text-base-content/80">
							{newCounts.d}
						</div>
					</div>
				</div>
				<Chart figures={newCounts} />
			{/await}
		</div>
	</div>
</div>
<!-- 
/////////////////////////////////////////
/
/
/
/
/	Modals
/
/
/	
/
///////////////////////////////////////// 
-->
<dialog bind:this={uploadModal} class="view-upload-modal modal overflow-y-scroll">
	<div class="w-[30rem] rounded-lg bg-base-100 lg:w-[40rem]">
		<h2 class="rounded-t-lg bg-primary p-5 font-bold text-base-100">Add Via CSV File Upload</h2>

		<div class="p-4">
			<form id="form-fileupload" enctype="multipart/form-data" action="?/uploadfile" method="POST" use:enhance>
				<label for="fileupload" class="text-lg">Upload your file (.csv):</label>
				<input
					type="file"
					name="fileupload"
					id="fileupload"
					accept=".csv"
					class="file-input file-input-bordered file-input-primary w-full"
					onchange={() => {
						const file = document.getElementById('fileupload').files[0];
						console.log(file);
						var reader = new FileReader();

						// Read file into memory as UTF-16
						reader.readAsText(file);
						reader.onload = (evt) => {
							//const csv = reader.result;
							const csv = evt.target.result;
							outsideVar = Papa.parse(csv, { delimiter: ',', header: true, dynamicTyping: false });
						};

						uploadPreview = true;
					}}
				/>
			</form>
			<div class="modal-action flex justify-end pb-4">
				<form method="dialog">
					<button class="btn btn-outline text-lg">Close</button>
				</form>
				<button
					form="form-fileupload"
					class="btn btn-primary min-w-32 text-lg font-bold"
					onclick={() => {
						formUploadButtonSpinner = true;
						const dialogUpload = document.getElementById('upload_modal');
						setTimeout(() => {
							dialogUpload.close('Closed');
						}, 1500);
					}}
					>{#if formUploadButtonSpinner}<span class="loading loading-spinner loading-md"
						></span>{:else}Upload{/if}</button
				>
			</div>
			{#if uploadPreview}
				{#await outsideVar}
					<span class="loading loading-spinner loading-md text-primary"></span>
				{:then outsideVar}
					{#key outsideVar}
						<h3 class="mt-8">Preview</h3>
						<div class="grid grid-cols-4 rounded-lg border border-gray-400 text-gray-400">
							<div
								class="rounded-tl-lg border-b border-r border-b-gray-400 border-r-gray-400 bg-base-200 p-2 font-bold"
							>
								Name
							</div>
							<div class="border-b border-r border-b-gray-400 border-r-gray-400 bg-base-200 p-2 font-bold">Dept</div>
							<div class="border-b border-r border-b-gray-400 border-r-gray-400 bg-base-200 p-2 font-bold">Grade</div>
							<div class="rounded-tr-lg border-b border-b-gray-400 bg-base-200 p-2 font-bold">Remarks</div>
							{#each outsideVar.data as item}
								{#if item.Name != '' && item.Dept != '' && item.Grade != ''}
									<div class="border-b border-r border-b-gray-400 border-r-gray-400 p-2">{item.Name}</div>
									<div class="border-b border-r border-b-gray-400 border-r-gray-400 p-2">{item.Dept}</div>
									<div class="border-b border-r border-b-gray-400 border-r-gray-400 p-2">{item.Grade}</div>
									<div class="border-b border-b-gray-400 p-2">{item.Remarks}</div>
								{/if}
							{/each}
						</div>
					{/key}
				{/await}
			{:else}
				<div class="mt-8">CSV file must only have 4 columns: Name, Dept, Grade, Remarks. For example:</div>
				<div class="grid grid-cols-4 rounded-lg border border-gray-400 text-gray-400">
					<div class="rounded-tl-lg border-b border-r border-b-gray-400 border-r-gray-400 bg-base-200 p-2 font-bold">
						Name
					</div>
					<div class="border-b border-r border-b-gray-400 border-r-gray-400 bg-base-200 p-2 font-bold">Dept</div>
					<div class="border-b border-r border-b-gray-400 border-r-gray-400 bg-base-200 p-2 font-bold">Grade</div>
					<div class="rounded-tr-lg border-b border-b-gray-400 bg-base-200 p-2 font-bold">Remarks</div>

					<div class="border-r border-r-gray-400 p-2">Mary</div>
					<div class="border-r border-r-gray-400 p-2">Sue</div>
					<div class="border-r border-r-gray-400 p-2">B</div>
					<div class="p-2">She was hardworking.</div>
				</div>
			{/if}
		</div>
	</div>
</dialog>

<dialog bind:this={deleteSessionModal} class="delete-session-modal">
	<div class="rounded-lg bg-base-100">
		<h2 class="rounded-t-lg bg-error p-5 font-bold text-base-100">Delete session</h2>
		<p class="px-4 py-4">
			Are you sure you want to <b>delete this session and all data</b>? You cannot undo this action.
		</p>
		<div class="modal-action flex justify-end p-4">
			<form method="dialog">
				<button class="btn btn-outline text-lg">Close</button>
			</form>
			<form method="POST" action="?/deleteSession" use:enhance>
				<button
					id="confirm-delete-session-button-clicked"
					class="btn btn-error min-w-40 text-lg text-base-100"
					onclick={() => {
						deleteSessionButtonClickedSpinner = true;
					}}
					>{#key deleteSessionButtonClickedSpinner}
						{#if deleteSessionButtonClickedSpinner}
							<span class="left-50 loading loading-spinner absolute"></span>
							<span class="invisible">Delete Session</span>
						{:else}
							<span>Delete Session</span>
						{/if}
					{/key}
				</button>
			</form>
		</div>
	</div>
</dialog>

{#key form}
	{#if form?.formRedirectFailed}
		<div
			class="fade-in fade-out toast toast-end transition duration-75 ease-out"
			in:slide={{ duration: 150, axis: 'x', easing: circOut }}
			out:slide={{ duration: 300, axis: 'x', easing: circOut }}
		>
			<div class="alert flex justify-center bg-error font-bold text-base-100">
				No special characters, symbols, spaces!
			</div>
		</div>
	{/if}
{/key}

<!-- 
	/////////////////////////////////////////
	/
	/
	/
	/
	/	Toasts
	/
	/
	/	
	/
	///////////////////////////////////////// 
	-->

{#if form?.formSaveSuccess}
	<div class="fade-in fade-out toast toast-end z-10 transition duration-75 ease-out">
		<div class="alert flex justify-center bg-lime-500 text-lg font-bold text-base-100">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="2em"
				height="2em"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-mood-check inline stroke-base-100"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M20.925 13.163a8.998 8.998 0 0 0 -8.925 -10.163a9 9 0 0 0 0 18" />
				<path d="M9 10h.01" />
				<path d="M15 10h.01" />
				<path d="M9.5 15c.658 .64 1.56 1 2.5 1s1.842 -.36 2.5 -1" />
				<path d="M15 19l2 2l4 -4" />
			</svg>Saved successfully!
		</div>
	</div>
{/if}
{#if form?.formSaveFail}
	<div
		class="fade-in fade-out toast toast-end z-10 transition duration-75 ease-out"
		in:slide={{ duration: 150, axis: 'x', easing: circOut }}
		out:slide={{ duration: 300, axis: 'x', easing: circOut }}
	>
		<div class="alert flex justify-center bg-error text-lg font-bold text-base-100">Error saving!</div>
	</div>
{/if}
{#if form?.formUploadSuccess}
	<div class="fade-in fade-out toast toast-end z-10 transition duration-75 ease-out">
		<div class="alert flex justify-center bg-lime-500 text-lg font-bold text-base-100">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="2em"
				height="2em"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-mood-check inline stroke-base-100"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M20.925 13.163a8.998 8.998 0 0 0 -8.925 -10.163a9 9 0 0 0 0 18" />
				<path d="M9 10h.01" />
				<path d="M15 10h.01" />
				<path d="M9.5 15c.658 .64 1.56 1 2.5 1s1.842 -.36 2.5 -1" />
				<path d="M15 19l2 2l4 -4" />
			</svg>Uploaded successfully!
		</div>
	</div>
{/if}

{#if form?.editInsertSuccess}
	<div class="fade-in fade-out toast toast-end z-10 transition duration-75 ease-out">
		<div class="alert flex justify-center bg-lime-500 text-lg font-bold text-base-100">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="2em"
				height="2em"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-mood-check inline stroke-base-100"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M20.925 13.163a8.998 8.998 0 0 0 -8.925 -10.163a9 9 0 0 0 0 18" />
				<path d="M9 10h.01" />
				<path d="M15 10h.01" />
				<path d="M9.5 15c.658 .64 1.56 1 2.5 1s1.842 -.36 2.5 -1" />
				<path d="M15 19l2 2l4 -4" />
			</svg>Edited successfully!
		</div>
	</div>
{:else if form?.editInsertFailedGrade}
	<div class="fade-in fade-out toast toast-end z-10 transition duration-75 ease-out">
		<div class="alert flex justify-center bg-error text-lg font-bold text-base-100">
			Failed to edit! Grade should be a single alphabet (A, B, C+, C, C-, D)
		</div>
	</div>
{/if}

<style>
	.view-outline {
		view-transition-name: view-outline;
	}
	.view-home-sidebar {
		view-transition-name: view-home-sidebar;
	}
	.view-home-info {
		view-transition-name: view-home-info;
	}
	.view-summary-sidebar {
		view-transition-name: view-summary-sidebar;
	}
	.view-ranking-title {
		view-transition-name: view-ranking-title;
	}
	.view-add-sidebar {
		view-transition-name: view-add-sidebar;
	}
	.view-upload-sidebar {
		view-transition-name: view-upload-sidebar;
	}
	.view-manage-sidebar {
		view-transition-name: view-manage-sidebar;
	}
	.view-content {
		view-transition-name: view-content;
	}

	.delete-session-modal {
		view-transition-name: delete-session-modal;
		animation: none;
	}
	.view-upload-modal {
		view-transition-name: view-upload-modal;
		animation: none;
	}

	.fade-in {
		opacity: 1;
		display: hidden;
		animation: fade-in-keyframe 0.1s linear;
	}

	.fade-out {
		opacity: 0;
		display: hidden;
		animation: fade-out-keyframe 3s linear;
	}

	@keyframes fade-in-keyframe {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes fade-out-keyframe {
		0% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			display: hidden;
		}
	}

	/* 	.a-icon::before {
		content: 'A';
		font-size: 1em;
		font-weight: 800;
		color: #223b58;
		position: absolute;
		left: 35%;
		top: 15%;
		z-index: 5;
	}
	.a-icon {
		height: 2em;
		width: 2em;
		position: relative;
		background-color: #cddaea;
		border-radius: 50%;
		display: inline-block;
	} */
</style>
