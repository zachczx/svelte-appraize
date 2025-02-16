<script lang="ts">
	import type { PageProps } from './$types';
	import { CalculateDateAgo } from '$lib/utils';
	import { enhance } from '$app/forms';

	import { slide } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import Home from '$lib/svg/Home.svelte';
	import { editFormSubmitKeyboardShortcut } from '$lib/FormSubmitKeyboardShortcut';
	import { page } from '$app/stores';

	import DragDrop from '$lib/DragDrop.svelte';
	import Chart from '$lib/Chart.svelte';
	import FileUploadForm from '$lib/FileUploadForm.svelte';
	import GenericModal from '$lib/GenericModal.svelte';

	let { data, form }: PageProps = $props();

	let formAutoSaveSession: HTMLFormElement; //= $state();
	let formSaveSuccessLoading = $state(false);
	let autoSave = $state(true);
	let nameData = $state();
	let deptData = $state();
	let gradeData = $state();
	let remarksData = $state();

	let deleteSessionButtonClickedSpinner = $state(false);

	let order = $state(data.sequence);

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
		let tempResult = await data.result;

		if (tempResult) {
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
		}
		newCounts.cTotal = newCounts.cPlus + newCounts.c + newCounts.cMinus;
		newCounts.total = newCounts.a + newCounts.b + newCounts.cTotal + newCounts.d;
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
					formSaveSuccessLoading = true;
					setTimeout(() => {
						formSaveSuccessLoading = false;
					}, 2000);
				}
			}
		}, 20000);

		if (form?.uploadSuccess) {
			uploadModal.close();
		}
	});

	let deleteSessionModal: HTMLDialogElement;
	let uploadModal: HTMLDialogElement;
	let creditModal = $state() as HTMLDialogElement;
	let lockModal = $state() as HTMLDialogElement;
	let lockForm: HTMLFormElement;

	let searchInput: string = $state('');
	let submittedSpinner = $state(false);

	let currentPageUrl = $state($page.url.origin + '/session/' + data.session?.slug);
	let shareCopiedSuccess = $state(false);

	let filterKeyword: string = $state('');
	interface FilterGrades {
		[index: string]: boolean;
	}
	let filterGrade: FilterGrades = $state({
		a: true,
		b: true,
		'c+': true,
		c: true,
		'c-': true,
		d: true,
	});
	let filterIsTalent: boolean = $state(true);
	let filterIsNotTalent: boolean = $state(true);

	let filteredResults = $derived.by(() => {
		let filteredResults;

		if (data.result) {
			filteredResults = data.result.filter((entry) => {
				if (filterKeyword.length > 0) {
					if ((entry.talent && filterIsTalent) || (!entry.talent && filterIsNotTalent)) {
						if (
							entry.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
							entry.dept.toLowerCase().includes(filterKeyword.toLowerCase()) ||
							entry.remarks?.toLowerCase().includes(filterKeyword.toLowerCase())
						) {
							for (const key in filterGrade) {
								if (entry.grade === key.toUpperCase()) return entry;
							}
						}
					}
				}

				if (filterKeyword.length === 0) {
					if ((entry.talent && filterIsTalent) || (!entry.talent && filterIsNotTalent)) {
						for (const key in filterGrade) {
							if (filterGrade[key]) {
								if (entry.grade === key.toUpperCase()) {
									return entry;
								}
							}
						}
					}
				}
			});
		}
		return filteredResults;
	});
</script>

<svelte:head>
	<title>Appraize | {data.session?.title}</title>
</svelte:head>
<div class="grid grid-cols-[auto_1fr_auto]">
	<div class="grid h-full grid-rows-[1fr_auto]">
		<div class="grid content-start border-base-300/10 bg-base-200 px-4 pb-4 pt-8 text-2xl lg:border-r-2">
			<div class="hidden items-center border-b-2 border-b-base-300/10 md:grid">
				<form method="POST" id="view-top-navbar-input" action="?/redirect" class="pb-8" use:enhance>
					<label class="input input-bordered flex w-full items-center rounded-full" for="session">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
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
							class="grow"
							autocomplete="off"
							onkeydown={(evt) => {
								editFormSubmitKeyboardShortcut(evt, 'view-top-navbar-input');
							}}
							required
						/>
						<button class="-me-3 ms-2">
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

			<div class="grid content-start">
				<div class="grid gap-2">
					<h3 class="flex items-center gap-2 text-lg font-extrabold text-base-content/70">
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
					<ul class="ms-2 border-l-4 border-l-base-300 ps-4 text-base font-medium text-base-content/70">
						<li>
							<details class="collapse rounded-lg bg-base-200">
								<summary class=""
									><div
										class="flex cursor-pointer items-center gap-4 rounded-lg p-2 font-medium hover:bg-primary hover:text-primary-content"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1.3em"
											height="1.3em"
											class="tabler:pencil"
											viewBox="0 0 24 24"
											><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16zm9.5-13.5l4 4"
											/></svg
										>Edit Title
									</div></summary
								>
								<div class="collapse-content ms-1 mt-2 border-l-4 border-l-base-300 p-0 ps-8 text-base font-medium">
									<form method="POST" action="?/editSessionTitle" class="grid gap-1" use:enhance>
										<label class="input input-bordered flex items-center rounded-full">
											<input
												type="text"
												name="title"
												value={data.session?.title}
												class="w-full"
												placeholder="Edit Title"
												autocomplete="off"
												required
											/>
											<button
												aria-label="edit"
												class="h-8.5 w-8.5 -me-2 ms-2 flex items-center justify-center rounded-full bg-primary p-1.5 text-primary-content"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="1.5em"
													height="1.5em"
													class="tabler:pencil h-6 w-6"
													viewBox="0 0 24 24"
													><path
														fill="none"
														stroke="currentColor"
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="3"
														d="M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16zm9.5-13.5l4 4"
													/></svg
												>
											</button>
										</label>
										<input type="hidden" name="session-id" value={data.session?.id} />
									</form>
								</div>
							</details>
						</li>
						<li>
							<button
								class="flex w-full items-center gap-4 rounded-lg p-2 hover:bg-error hover:text-error-content"
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
							<button
								class="flex w-full items-center gap-4 rounded-lg p-2 hover:bg-primary hover:text-primary-content"
								onclick={() => {
									lockModal.showModal();
								}}
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="1.3em"
									height="1.3em"
									class="tabler:lock"
									viewBox="0 0 24 24"
									><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										><path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" /><path
											d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4"
										/></g
									></svg
								>Lock
							</button>
						</li>
						<li>
							<details class="collapse rounded-lg bg-base-200">
								<summary class=""
									><div
										class="flex cursor-pointer items-center gap-4 rounded-lg p-2 font-medium hover:bg-primary hover:text-primary-content"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1.3em"
											height="1.3em"
											class="tabler:share"
											viewBox="0 0 24 24"
											><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m12-6a3 3 0 1 0 6 0a3 3 0 1 0-6 0m0 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m-6.3-7.3l6.6-3.4m-6.6 6l6.6 3.4"
											/></svg
										>Share
									</div></summary
								>
								<div class="collapse-content ms-1 mt-2 border-l-4 border-l-base-300 p-0 ps-8 text-lg font-medium">
									<label class="input input-bordered flex items-center rounded-full">
										<input type="text" name="url" bind:value={currentPageUrl} class="w-full" autocomplete="off" />
										<button
											aria-label="edit"
											class="h-8.5 w-8.5 -me-2 ms-2 flex items-center justify-center rounded-full {shareCopiedSuccess
												? 'bg-success'
												: 'bg-primary'} p-1.5 text-primary-content"
											onclick={() => {
												navigator.clipboard.writeText(currentPageUrl);
												shareCopiedSuccess = true;
												setTimeout(() => {
													shareCopiedSuccess = false;
												}, 5000);
											}}
										>
											{#if shareCopiedSuccess}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="1.2em"
													height="1.2em"
													class="tabler:check h-5 w-5"
													viewBox="0 0 24 24"
													><path
														fill="none"
														stroke="currentColor"
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="4"
														d="m5 12l5 5L20 7"
													/></svg
												>
											{:else}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="1.2em"
													height="1.2em"
													class="tabler:copy h-4.5 w-4.5"
													viewBox="0 0 24 24"
													><g
														fill="none"
														stroke="currentColor"
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="3"
														><path
															d="M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z"
														/><path d="M4.012 16.737A2 2 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1" /></g
													></svg
												>
											{/if}
										</button>
									</label>
								</div>
							</details>
						</li>
					</ul>
				</div>
				<div class="mt-4 grid gap-2 pt-4">
					<h3 class="flex items-center gap-4 text-lg font-extrabold text-base-content/70">
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
						>Add Many
					</h3>

					<ul class="ms-2 border-l-4 border-l-base-300 ps-4 text-base font-medium text-base-content/70">
						<!-- <li>
							<details class="collapse rounded-lg bg-base-200">
								<summary class=""
									><div
										class="flex cursor-pointer items-center gap-4 rounded-lg p-2 text-lg font-medium hover:bg-primary hover:text-primary-content"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1.3em"
											height="1.3em"
											class="tabler:square-plus"
											viewBox="0 0 24 24"
											><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12h6m-3-3v6M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
											/></svg
										>Create
									</div></summary
								>
								<div
									class="collapse-content ms-1 mt-2 space-y-2 border-l-4 border-l-base-300 p-0 ps-4 text-lg font-medium"
								>
									<form method="POST" id="insert-form" action="?/insert" class="grid gap-1" use:enhance>
										<label class="input input-bordered flex items-center">
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
												class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus me-2 hidden flex-none text-base-content/50 xl:flex"
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
												autocomplete="off"
												required
											/>
										</label>

										<label class="input input-bordered flex items-center">
											<Home class="me-2 hidden flex-none stroke-base-content/50 xl:flex" />
											<input
												type="text"
												name="dept"
												bind:value={deptData}
												class="grow"
												placeholder="Dept"
												onkeydown={(evt) => {
													editFormSubmitKeyboardShortcut(evt, 'insert-form');
												}}
												autocomplete="off"
												required
											/>
										</label>

										<select bind:value={gradeData} name="grade" class="select select-bordered text-base-content/50">
											<option value="A">A</option>
											<option value="B">B</option>
											<option value="C+">C+</option>
											<option value="C" selected>C</option>
											<option value="C-">C-</option>
											<option value="D">D</option>
										</select>

										<label class="input input-bordered flex w-full items-center border text-base-content/50">
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
												<path
													d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"
												/>
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
										<input type="hidden" name="session-id" value={data.session.id} />
										<button class="btn btn-primary text-lg font-bold text-primary-content" aria-label="Add">Add</button>
									</form>
								</div>
							</details>
						</li> -->
						<li>
							<button
								class="flex w-full items-center gap-4 rounded-lg p-2 font-medium hover:bg-primary hover:text-primary-content"
								onclick={() => {
									uploadModal.showModal();
								}}
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="1.3em"
									height="1.3em"
									class="tabler:upload"
									viewBox="0 0 24 24"
									><path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5l5 5m-5-5v12"
									/></svg
								>Upload .csv</button
							>
						</li>
					</ul>
					{#if form?.insertNameMissing}<span class="text-error">Please enter a name:</span>{/if}
					{#if form?.insertDeptMissing}<span class="text-error">Please enter a dept:</span>{/if}
					{#if form?.insertGradeMissing}<span class="text-error">Please select a grade:</span>{/if}
				</div>

				<div class="mt-4 grid gap-2 pt-4">
					<h3 class="flex items-center gap-2 text-lg font-extrabold text-base-content/70">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.3em"
							height="1.3em"
							class="tabler:progress-check"
							viewBox="0 0 24 24"
							><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								><path
									d="M10 20.777a9 9 0 0 1-2.48-.969M14 3.223a9.003 9.003 0 0 1 0 17.554m-9.421-3.684a9 9 0 0 1-1.227-2.592M3.124 10.5c.16-.95.468-1.85.9-2.675l.169-.305m2.714-2.941A9 9 0 0 1 10 3.223"
								/><path d="m9 12l2 2l4-4" /></g
							></svg
						>Progress
					</h3>
					<ul class="ms-2 border-l-4 border-l-base-300 ps-4 text-base font-medium text-base-content/70">
						<li>
							<div class="flex items-center gap-4 rounded-lg p-2 hover:bg-primary hover:text-primary-content">
								<label for="auto-save-checkbox" class="flex grow items-center font-medium"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.3em"
										height="1.3em"
										class="material-symbols:save-clock-outline-rounded me-4"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M5 19V5v5.075V10zm0 2q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h11.175q.4 0 .763.15t.637.425l2.85 2.85q.275.275.425.638t.15.762v1.55q0 .425-.288.713t-.712.287t-.712-.288T19 9.376V7.85L16.15 5H5v14h5.8q.425 0 .713.288T11.8 20t-.288.713T10.8 21zm13 1q-2.075 0-3.537-1.463T13 17t1.463-3.537T18 12t3.538 1.463T23 17t-1.463 3.538T18 22m.5-5.2v-2.3q0-.2-.15-.35T18 14t-.35.15t-.15.35v2.275q0 .2.075.388t.225.337l1.525 1.525q.15.15.35.15t.35-.15t.15-.35t-.15-.35zM7 10h7q.425 0 .713-.288T15 9V7q0-.425-.288-.712T14 6H7q-.425 0-.712.288T6 7v2q0 .425.288.713T7 10m4.05 7.85q-.025-.225-.038-.437T11 16.975q0-1.35.5-2.6t1.45-2.225q-.225-.075-.462-.112T12 12q-1.25 0-2.125.875T9 15q0 .975.563 1.763t1.487 1.087"
										/></svg
									>Auto save {#if formSaveSuccessLoading}
										<span class="loading loading-spinner loading-sm ms-4 text-primary"></span>
									{/if}</label
								>

								<form
									method="POST"
									action="/autosave"
									bind:this={formAutoSaveSession}
									use:enhance={() => {
										return async ({ update }) => {
											update({ reset: false, invalidateAll: false });
										};
									}}
								>
									<input type="hidden" name="order" bind:value={order} />
									<input type="hidden" name="session-id" value={data.session?.id} />
								</form>
								<input
									type="checkbox"
									id="auto-save-checkbox"
									class="toggle toggle-primary toggle-sm"
									bind:checked={autoSave}
								/>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="content-end bg-base-200 px-8 pb-4 text-sm">
			<ul>
				<li>© 2024 Zixian Chen</li>
				<li>
					<button aria-label="credits" class="underline" onclick={() => creditModal.showModal()}>Credits</button>
				</li>
			</ul>
		</div>
	</div>

	<GenericModal title="Credits" bind:htmlElement={creditModal}>
		<ul class="list-disc">
			<li class="ms-6">
				<a href="https://www.figma.com/community/file/1130301037961264190" target="_blank">Empty state illustration</a>
				by
				<a href="https://www.behance.net/boriskozelev" target="_blank">@boriskozelev</a>
			</li>
			<li class="ms-6">
				Alien spaceship, naughty dog illustrations by
				<a href="https://www.pixeltrue.com/" class="underline" target="_blank" title="Icons"> Pixel True </a>
			</li>
		</ul>
	</GenericModal>

	<GenericModal title="Lock Session" bind:htmlElement={lockModal}
		><form
			bind:this={lockForm}
			action="?/toggleLock"
			method="POST"
			class="grid grid-cols-2 justify-items-center"
			use:enhance
		>
			<label class="label-lock grid w-full cursor-pointer justify-items-center p-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					class="tabler:lock h-36 w-36"
					viewBox="0 0 24 24"
					><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						><path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" /><path
							d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4"
						/></g
					></svg
				>
				<div class="grid pt-4 text-center">
					<p class="text-xl font-bold">Locked</p>
					<p>Only you can see this</p>
				</div>
				<input
					type="radio"
					name="locked"
					value="true"
					class="radio hidden"
					checked={data.session?.locked ? true : undefined}
					onchange={() => {
						lockForm.requestSubmit();
					}}
				/>
			</label>

			<label class="label-lock grid w-full cursor-pointer justify-items-center p-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					class="tabler:lock-open-2 h-36 w-36"
					viewBox="0 0 24 24"
					><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						><path d="M3 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path
							d="M9 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m4-5V7a4 4 0 1 1 8 0v4"
						/></g
					></svg
				>
				<div class="grid pt-4 text-center">
					<p class="text-xl font-bold">Unlocked</p>
					<p>Everyone can see this</p>
				</div>
				<input
					type="radio"
					name="locked"
					value="false"
					class="radio hidden"
					checked={data.session?.locked === false || null || undefined ? true : undefined}
					onchange={() => {
						lockForm.requestSubmit();
					}}
				/>
			</label>
		</form></GenericModal
	>

	<div class="min-h-dvh w-full bg-base-100 px-2 pb-4 pt-8 lg:pt-8">
		<div class="grid justify-items-center space-y-4">
			<div class="w-full max-w-[800px] px-4 pb-4 md:px-10">
				<h1>{data.session?.title}</h1>
				<div class="grid gap-8 pt-12">
					{#key filteredResults}
						<DragDrop session={data.session} streamedResults={filteredResults} bind:value={order} />
					{/key}
				</div>
			</div>
		</div>
	</div>

	<div class="grid content-start overflow-hidden border-l-2 border-l-base-300/10 bg-base-200 px-4 pb-8">
		<h3 class="justify-self-start pt-8 text-3xl font-extrabold text-base-content/85">Details</h3>
		<div class="mt-8 grid content-start">
			<details open>
				<summary class="flex items-center"
					><h3 class="flex grow items-center gap-2 justify-self-start text-lg font-extrabold text-base-content/70">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.3em"
							height="1.3em"
							class="tabler:filter text-base-content/50"
							viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4h16v2.172a2 2 0 0 1-.586 1.414L15 12v7l-6 2v-8.5L4.52 7.572A2 2 0 0 1 4 6.227z"
							/></svg
						>Filter
					</h3>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						class="tabler:chevron-down arrow-down text-lg"
						viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m6 9l6 6l6-6"
						/></svg
					>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						class="tabler:chevron-up arrow-up text-lg"
						viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m6 15l6-6l6 6"
						/></svg
					></summary
				>
				<ul class="ms-2 mt-2 border-l-4 border-l-base-300 ps-8 text-base font-medium text-base-content/70">
					<li class="py-2">
						<div class="flex items-center gap-2">
							<label class="input join-item input-bordered flex w-full items-center rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1.3em"
									height="1.3em"
									class="tabler:filter me-4 text-base-content/50"
									viewBox="0 0 24 24"
									><path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 4h16v2.172a2 2 0 0 1-.586 1.414L15 12v7l-6 2v-8.5L4.52 7.572A2 2 0 0 1 4 6.227z"
									/></svg
								>
								<input
									bind:value={filterKeyword}
									class="grow text-base"
									placeholder="Filter by keyword"
									autocomplete="off"
								/>
							</label>
						</div>
					</li>
					<li class="py-2">
						<div class="grid grid-cols-3 gap-1">
							<label class="col-span-3 flex cursor-pointer items-center gap-2">
								<input type="checkbox" bind:checked={filterGrade.a} class="checkbox-primary checkbox checkbox-sm" />
								<span class="label-text text-base">A</span>
							</label>
							<label class="col-span-3 flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									bind:checked={filterGrade.b}
									class="checkbox-primary checkbox checkbox-sm"
								/><span class="label-text text-base">B</span>
							</label>
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									bind:checked={filterGrade['c+']}
									class="checkbox-primary checkbox checkbox-sm"
								/><span class="label-text text-base">C+</span>
							</label>
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									bind:checked={filterGrade.c}
									class="checkbox-primary checkbox checkbox-sm"
								/><span class="label-text text-base">C</span>
							</label>
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									bind:checked={filterGrade['c-']}
									class="checkbox-primary checkbox checkbox-sm"
								/><span class="label-text text-base">C-</span>
							</label>
							<label class="col-span-3 flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									bind:checked={filterGrade.d}
									class="checkbox-primary checkbox checkbox-sm"
								/><span class="label-text text-base">D</span>
							</label>
						</div>
					</li>
					<li class="py-2">
						<div class="grid grid-cols-3 gap-1">
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									bind:checked={filterIsTalent}
									class="checkbox-primary checkbox checkbox-sm"
								/><span class="label-text text-base"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.2em"
										height="1.2em"
										class="tabler:star-filled text-yellow-400"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="m8.243 7.34l-6.38.925l-.113.023a1 1 0 0 0-.44 1.684l4.622 4.499l-1.09 6.355l-.013.11a1 1 0 0 0 1.464.944l5.706-3l5.693 3l.1.046a1 1 0 0 0 1.352-1.1l-1.091-6.355l4.624-4.5l.078-.085a1 1 0 0 0-.633-1.62l-6.38-.926l-2.852-5.78a1 1 0 0 0-1.794 0z"
										/></svg
									></span
								>
							</label>
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									bind:checked={filterIsNotTalent}
									class="checkbox-primary checkbox checkbox-sm"
								/><span class="label-text text-base"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.2em"
										height="1.2em"
										class="tabler:star text-base-content/50"
										viewBox="0 0 24 24"
										><path
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
										/></svg
									></span
								>
							</label>
						</div>
					</li>
				</ul>
			</details>
		</div>

		<div class="mt-4 grid content-start pt-4">
			<details open>
				<summary class="flex items-center"
					><h3 class="flex grow items-center gap-2 text-lg font-extrabold text-base-content/70">
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						class="tabler:chevron-down arrow-down text-lg"
						viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m6 9l6 6l6-6"
						/></svg
					>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						class="tabler:chevron-up arrow-up text-lg"
						viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m6 15l6-6l6 6"
						/></svg
					></summary
				>
				{#await newCounts}
					<span class="loading loading-spinner my-8 text-primary"></span>
				{:then newCounts}
					<div class="justify-items-around grid grid-cols-4 pb-2 pt-4">
						<div class="grid content-center justify-items-center rounded-l-lg bg-[#F66D44] py-1">
							<div class="text-sm font-medium">A</div>
							<div class="flex animate-scale items-center justify-center text-lg font-black text-base-content/80">
								{newCounts.a}
							</div>
						</div>
						<div class="grid content-center justify-items-center bg-[#FEAE65]/60">
							<div class="text-sm font-medium">B</div>
							<div class="flex animate-scale items-center justify-center text-lg font-black text-base-content/80">
								{newCounts.b}
							</div>
						</div>
						<div class="grid content-center justify-items-center bg-[#E6F69D]">
							<div class="text-sm font-medium">C</div>
							<div class="flex animate-scale items-center justify-center text-lg font-black text-base-content/80">
								{newCounts.c}
							</div>
						</div>
						<div class="grid content-center justify-items-center rounded-r-lg bg-[#AADEA7]">
							<div class="text-sm font-medium">D</div>
							<div class="flex animate-scale items-center justify-center text-lg font-black text-base-content/80">
								{newCounts.d}
							</div>
						</div>
					</div>
					<Chart figures={newCounts} />
				{/await}
			</details>
		</div>

		<div class="mt-4 grid content-start gap-y-2 pt-4">
			<details>
				<summary class="flex items-center"
					><h3 class="mb-1 flex grow items-center gap-2 justify-self-start text-lg font-extrabold text-base-content/70">
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						class="tabler:chevron-down arrow-down text-lg"
						viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m6 9l6 6l6-6"
						/></svg
					>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						class="tabler:chevron-up arrow-up text-lg"
						viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m6 15l6-6l6 6"
						/></svg
					></summary
				>
				<ul class="ms-2 border-l-4 border-l-base-300 ps-4 text-base font-medium text-base-content/70">
					<li>
						<div class="ms-1 flex items-center gap-2 p-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1.3em"
								height="1.3em"
								class="tabler:calendar-time"
								viewBox="0 0 24 24"
								><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									><path d="M11.795 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path
										d="M14 18a4 4 0 1 0 8 0a4 4 0 1 0-8 0m1-15v4M7 3v4m-4 4h16"
									/><path d="M18 16.496V18l1 1" /></g
								></svg
							>

							{#if data.session?.timestamp}
								{CalculateDateAgo(data.session.timestamp)}
							{:else}
								Oops, something went wrong
							{/if}
						</div>
					</li>
					<li>
						<div class="ms-1 flex items-center gap-2 p-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"
								><path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h3.5m4.92.61a2.1 2.1 0 0 1 2.97 2.97L18 22h-3v-3z"
								/></svg
							><span class="max-w-48 truncate">{data.session?.email}</span>
						</div>
					</li>
				</ul>
			</details>
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
<dialog bind:this={uploadModal} class="modal overflow-y-scroll">
	<div class="w-[30rem] rounded-lg bg-base-100 lg:w-[40rem]">
		<form method="dialog" class="grid justify-items-end p-2">
			<button aria-label="close">
				<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" class="tabler:x" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M18 6L6 18M6 6l12 12"
					/></svg
				>
			</button>
		</form>
		<FileUploadForm session={data.session} />
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
				<input type="hidden" name="session-id" value={data.session?.id} />
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
{#if form?.editLockedSuccess}
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
			</svg>Changed lock status!
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
{#if form?.uploadSuccess}
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
{/if}

<style>
	.delete-session-modal {
		view-transition-name: delete-session-modal;
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

	details {
		cursor: pointer;
		summary > .arrow-up {
			display: none;
		}
		&[open] > summary > .arrow-up {
			display: flex;
		}
		&[open] > summary > .arrow-down {
			display: none;
		}
	}

	.label-lock {
		border: 2px solid transparent;
		border-radius: 20px;

		&:has(> input:checked) {
			background-color: #fff6da;
			border: 2px solid #f4d793;
		}
	}
</style>
