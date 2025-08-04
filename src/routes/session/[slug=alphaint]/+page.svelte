<script lang="ts">
	import type { PageProps } from './$types';
	import { CalculateDateAgo } from '$lib/utils';
	import { applyAction, enhance } from '$app/forms';
	import { addToast, getToast } from '$lib/ToastBox.svelte';

	import { slide } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import Home from '$lib/svg/Home.svelte';
	import { editFormSubmitKeyboardShortcut } from '$lib/FormSubmitKeyboardShortcut';
	import { page } from '$app/stores';

	import DragDrop from '$lib/DragDrop.svelte';
	import Chart from '$lib/Chart.svelte';
	import FileUploadForm from '$lib/FileUploadForm.svelte';
	import GenericModal from '$lib/GenericModal.svelte';
	import Toaster from '$lib/Toaster.svelte';
	import SingleToastBox from '$lib/SingleToastBox.svelte';
	import { goto } from '$app/navigation';

	let { data, form }: PageProps = $props();
	let reactiveResults = $derived(data.results);
	let saveButtonSuccess = $state(false);

	let formAutoSaveSession: HTMLFormElement; //= $state();
	let formSaveSuccessLoading = $state(false);
	let autoSave = $state(true);
	let deleteSessionButtonClickedSpinner = $state(false);

	let addAuthorizedUserInput: string = $state('');
	let addAuthorizedUserExists = $derived.by(() => {
		let addAuthorizedUserExists;
		if (data.authorizedUsers) {
			for (const email of data.authorizedUsers) {
				if (addAuthorizedUserInput.toLowerCase().trim() === email.userEmail) {
					return true;
				}
			}
		}
		return false;
	});

	let order = $derived.by(() => {
		let order = '';

		let sequenceCutLastChar = order.length - 1;
		if (reactiveResults) {
			for (let i = 0; i < reactiveResults.length; i++) {
				if (i === 0) {
					order = String(reactiveResults[i].id);
				} else {
					order = order + ',' + reactiveResults[i].id;
				}
			}
			order.slice(sequenceCutLastChar);
		}
		return order;
	});

	let newCounts = $derived.by(() => {
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
		let tempResult = data.results;

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
		}, 40000);

		if (form?.uploadSuccess) {
			uploadModal.close();
		}
	});
	let saveOrder = $derived(order);
	let titleModal = $state() as HTMLDialogElement;
	let editTitleButtonSuccess = $state(false);

	let deleteSessionModal = $state() as HTMLDialogElement;
	let uploadModal: HTMLDialogElement;
	let creditModal = $state() as HTMLDialogElement;
	let lockModal = $state() as HTMLDialogElement;
	let lockForm: HTMLFormElement;
	let shareModal = $state() as HTMLDialogElement;

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

		if (reactiveResults) {
			filteredResults = reactiveResults.filter((entry) => {
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
		<div class="border-base-300/10 bg-base-200 grid content-start px-4 pt-4 pb-4 text-2xl lg:border-r-2">
			<div class="hidden items-center md:grid">
				<form method="POST" id="view-top-navbar-input" action="?/redirect" class="pb-8" use:enhance>
					<label class="input input-bordered flex w-full items-center rounded-full" for="session">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							class="tabler:player-track-next-filled text-base-content/30 me-4"
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
							placeholder="Go to session"
							class="grow"
							autocomplete="off"
							onkeydown={(evt) => {
								editFormSubmitKeyboardShortcut(evt, 'view-top-navbar-input');
							}}
							required
						/>
						<button class="ms-2 -me-3">
							{#if submittedSpinner && searchInput.length > 0}
								<span class="loading loading-spinner"></span>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="2.5em"
									height="2.5em"
									viewBox="0 0 24 24"
									class="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-right fill-primary inline group-hover:saturate-50"
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
					<h3 class="text-base-content/70 flex items-center gap-2 text-lg font-extrabold">
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
					<ul class="border-l-base-300 text-base-content/70 ms-2 border-l-4 ps-4 text-base font-medium">
						<li>
							<button
								class="hover:bg-primary hover:text-primary-content flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 font-medium"
								onclick={() => titleModal.showModal()}
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
								>Title
							</button>
						</li>

						<li>
							<button
								class="hover:bg-primary hover:text-primary-content flex w-full cursor-pointer items-center gap-4 rounded-lg p-2"
								onclick={() => lockModal.showModal()}
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
								>Permissions
							</button>
						</li>
						<li>
							<button
								class="hover:bg-primary hover:text-primary-content flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 font-medium"
								onclick={() => {
									shareModal.showModal();
								}}
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
							</button>
						</li>

						<li>
							<button
								class="hover:bg-error hover:text-error-content flex w-full cursor-pointer items-center gap-4 rounded-lg p-2"
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
					</ul>
				</div>
				<div class="mt-4 grid gap-2 pt-4">
					<h3 class="text-base-content/70 flex items-center gap-4 text-lg font-extrabold">
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
						>Import
					</h3>

					<ul class="border-l-base-300 text-base-content/70 ms-2 border-l-4 ps-4 text-base font-medium">
						<li>
							<button
								class="hover:bg-primary hover:text-primary-content flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 font-medium"
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
								>Import from .csv</button
							>
						</li>
					</ul>
					{#if form?.insertNameMissing}<span class="text-error">Please enter a name:</span>{/if}
					{#if form?.insertDeptMissing}<span class="text-error">Please enter a dept:</span>{/if}
					{#if form?.insertGradeMissing}<span class="text-error">Please select a grade:</span>{/if}
				</div>

				<div class="mt-4 grid gap-2 pt-4">
					<h3 class="text-base-content/70 flex items-center gap-2 text-lg font-extrabold">
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
					<ul class="border-l-base-300 text-base-content/70 ms-2 border-l-4 ps-4 text-base font-medium">
						<li>
							<div
								class="hover:bg-primary hover:text-primary-content flex cursor-pointer items-center gap-4 rounded-lg p-2"
							>
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
										<span class="loading loading-spinner loading-sm text-primary ms-4"></span>
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
									<input type="hidden" name="order" value={order} />
									<input type="hidden" name="session-id" value={data.session?.id} />
								</form>
								<input type="checkbox" id="auto-save-checkbox" class="toggle toggle-sm" bind:checked={autoSave} />
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="bg-base-200 content-end px-8 pb-4 text-sm">
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

	<GenericModal title="Share" bind:htmlElement={shareModal}>
		<label class="input input-bordered flex items-center rounded-full">
			<input type="text" name="url" bind:value={currentPageUrl} class="w-full" autocomplete="off" />
			<button
				aria-label="edit"
				class="ms-2 -me-2 flex h-8.5 w-8.5 items-center justify-center rounded-full {shareCopiedSuccess
					? 'bg-success'
					: 'bg-primary'} text-primary-content p-1.5"
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
						><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
							><path
								d="M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z"
							/><path d="M4.012 16.737A2 2 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1" /></g
						></svg
					>
				{/if}
			</button>
		</label>
		<div class="text-success mt-1 -mb-8 {shareCopiedSuccess ? undefined : 'opacity-0'} text-center">Copied!</div>
	</GenericModal>

	<GenericModal title="Edit Title" bind:htmlElement={titleModal}>
		<form
			method="POST"
			id="edit-title-modal"
			action="?/editSessionTitle"
			class="grid"
			use:enhance={() => {
				return async ({ result }) => {
					// I need this to suppress the urge to trigger load function.
					// 301 Redirect is triggered in form action if the edit is successful.
					if (result.type === 'redirect') {
						editTitleButtonSuccess = true;
						setTimeout(() => {
							editTitleButtonSuccess = false;
						}, 3000);
						goto(result.location);
					}
				};
			}}
		>
			<input
				type="text"
				name="title"
				value={data.session?.title}
				class="input input-bordered rounded-full"
				placeholder="Edit Title"
				autocomplete="off"
				required
			/>
			<input type="hidden" name="session-id" value={data.session?.id} />
		</form>
		{#snippet actionButton()}
			<button
				form="edit-title-modal"
				class="btn {editTitleButtonSuccess
					? 'btn-success'
					: 'btn-primary'} flex min-w-24 items-center gap-2 rounded-full text-base"
				>{#if editTitleButtonSuccess}<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.7em"
						height="1.7em"
						class="tabler:circle-check-filled"
						viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34m-1.293 5.953a1 1 0 0 0-1.32-.083l-.094.083L11 12.585l-1.293-1.292l-.094-.083a1 1 0 0 0-1.403 1.403l.083.094l2 2l.094.083a1 1 0 0 0 1.226 0l.094-.083l4-4l.083-.094a1 1 0 0 0-.083-1.32"
						/></svg
					>Edited{:else}Edit{/if}</button
			>
		{/snippet}
	</GenericModal>

	<GenericModal title="Permissions" bind:htmlElement={lockModal}
		><form
			bind:this={lockForm}
			action="?/toggleLock"
			method="POST"
			class="grid grid-cols-2 justify-items-center"
			use:enhance
		>
			<label class="label-lock grid w-full cursor-pointer justify-items-center p-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					class="tabler:lock h-16 w-16"
					viewBox="0 0 24 24"
					><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						><path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" /><path
							d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4"
						/></g
					></svg
				>
				<div class="grid pt-4 text-center">
					<p class="text-lg font-bold">Locked</p>
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

			<label class="label-lock grid w-full cursor-pointer justify-items-center p-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					class="tabler:lock-open-2 h-16 w-16"
					viewBox="0 0 24 24"
					><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						><path d="M3 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path
							d="M9 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m4-5V7a4 4 0 1 1 8 0v4"
						/></g
					></svg
				>
				<div class="grid pt-4 text-center">
					<p class="text-lg font-bold">Unlocked</p>
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
		</form>
		{#if data.session?.locked}
			<div class="mt-12 grid gap-4">
				<h3 class="text-lg">Current Users With Access</h3>
				<form method="post" action="?/addAuthorizedUser" use:enhance>
					<label
						class="input input-bordered {addAuthorizedUserExists
							? 'border-error text-error focus-within:border-error focus-within:outline-error'
							: undefined} flex items-center gap-4 rounded-full"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							class="tabler:plus text-base-content/50"
							viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 5v14m-7-7h14"
							/></svg
						>
						<input
							type="text"
							name="user-email"
							class="grow"
							placeholder="Add user"
							bind:value={addAuthorizedUserInput}
							autocomplete="off"
							required
						/>
						<button
							class="bg-neutral text-primary-content disabled:bg-primary/30 ms-2 -me-2.5 flex h-9 w-9 items-center justify-center rounded-full text-3xl font-black"
							aria-label="Add"
							disabled={addAuthorizedUserExists ? true : undefined}>+</button
						>
					</label>
					<input type="hidden" name="session-id" value={data.session?.id} />
				</form>

				{#if addAuthorizedUserExists}<div class="text-error">User was already added!</div>{/if}

				<ol class="max-h-32 list-decimal overflow-y-auto pe-8">
					{#if data.authorizedUsers.length > 0}
						{#each data.authorizedUsers as user}
							<div class="border-b-neutral/5 flex w-full items-center border-b-2 py-1 ps-4 last:border-b-transparent">
								<li class="grow"><span class="ps-2">{user.userEmail}</span></li>
								<form method="post" action="?/deleteAuthorizedUser" use:enhance>
									<button class="text-error flex items-center justify-center" aria-label="delete">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1em"
											height="1em"
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
										>
									</button>
									<input type="hidden" name="session-id" value={data.session?.id} />
									<input type="hidden" name="authorized-user-id" value={user.id} />
								</form>
							</div>
						{/each}
					{:else}
						No users authorized!
					{/if}
				</ol>
			</div>
		{/if}
	</GenericModal>

	<div class="bg-base-100 min-h-dvh w-full px-2 pt-8 pb-4 lg:pt-8">
		<div class="grid justify-items-center space-y-4">
			<div class="w-full max-w-[800px] px-4 pb-4 md:px-10">
				<h1>{data.session?.title}</h1>
				<div class="grid gap-8 pt-12">
					{#key filteredResults}
						{#await filteredResults}
							Loading........
						{:then filteredResults}
							<DragDrop session={data.session} results={filteredResults} value={saveOrder} />
						{/await}
					{/key}
					{#if filteredResults}
						{#if filteredResults.length > 0}
							<div class="mt-10 grid w-full grid-cols-2 content-center justify-self-center lg:justify-self-start">
								<form
									method="POST"
									action="?/save"
									class="content-center"
									use:enhance={() => {
										return async ({ result }) => {
											//I need this to suppress the urge to trigger load function
											if (result.type === 'success') {
												if (result.data?.formSaveSuccess) {
													saveButtonSuccess = true;
													setTimeout(() => {
														saveButtonSuccess = false;
													}, 3000);
												}
											}
										};
									}}
								>
									<input type="hidden" name="order" value={saveOrder} />
									<input type="hidden" name="session-id" value={data.session.id} />
									<button
										class="btn {saveButtonSuccess
											? 'btn-success'
											: 'btn-primary'} flex items-center gap-2 rounded-full text-base font-bold lg:min-w-48"
										>{#if saveButtonSuccess}<svg
												xmlns="http://www.w3.org/2000/svg"
												width="1.7em"
												height="1.7em"
												class="tabler:circle-check-filled"
												viewBox="0 0 24 24"
												><path
													fill="currentColor"
													d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34m-1.293 5.953a1 1 0 0 0-1.32-.083l-.094.083L11 12.585l-1.293-1.292l-.094-.083a1 1 0 0 0-1.403 1.403l.083.094l2 2l.094.083a1 1 0 0 0 1.226 0l.094-.083l4-4l.083-.094a1 1 0 0 0-.083-1.32"
												/></svg
											>{:else}<svg
												xmlns="http://www.w3.org/2000/svg"
												width="1.7em"
												height="1.7em"
												class="material-symbols:save-outline"
												viewBox="0 0 24 24"
												><path
													fill="currentColor"
													d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-2 .85L16.15 5H5v14h14zM12 18q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6zM5 7.85V19V5z"
												/></svg
											>{/if}{saveButtonSuccess ? 'Saved!' : 'Save Changes'}</button
									>
								</form>

								<form method="post" action="?/sort" class="justify-self-end" use:enhance>
									<input type="hidden" name="session-id" value={data.session.id} />
									<button class="btn btn-secondary flex items-center gap-2 rounded-full text-base font-bold lg:min-w-24"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="1.7em"
											height="1.7em"
											class="tabler:wand"
											viewBox="0 0 24 24"
											><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 21L21 6l-3-3L3 18zm9-15l3 3M9 3a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2m10 10a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2"
											/></svg
										>Sort</button
									>
								</form>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="border-l-base-300/10 bg-base-200 grid content-start overflow-hidden border-l-2 px-4 pb-8">
		<h3 class="text-base-content/85 justify-self-start pt-4 text-3xl font-extrabold">Details</h3>
		<div class="mt-8 grid content-start">
			<details open>
				<summary class="flex items-center"
					><h3 class="text-base-content/70 flex grow items-center gap-2 justify-self-start text-lg font-extrabold">
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
				<ul class="border-l-base-300 text-base-content/70 ms-2 mt-2 border-l-4 ps-8 text-base font-medium">
					<li class="py-2">
						<div class="flex items-center gap-2">
							<label class="input join-item input-bordered flex w-full items-center rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1.3em"
									height="1.3em"
									class="tabler:filter text-base-content/50 me-4"
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
					<li class="grid w-full justify-items-start py-2">
						<h3 class="text-base">Grade</h3>
						<div class="custom-checkbox">
							<label>
								<span>A</span><input type="checkbox" bind:checked={filterGrade.a} />
							</label>
							<label>
								<span>B</span><input type="checkbox" bind:checked={filterGrade.b} />
							</label>
							<label>
								<span>C+</span><input type="checkbox" bind:checked={filterGrade['c+']} />
							</label>
							<label>
								<span>C</span><input type="checkbox" bind:checked={filterGrade.c} />
							</label>
							<label>
								<span>C-</span><input type="checkbox" bind:checked={filterGrade['c-']} />
							</label>
							<label>
								<span>D</span><input type="checkbox" bind:checked={filterGrade.d} />
							</label>
						</div>
						<h3 class="mt-4 text-base">Star</h3>
						<div class="custom-checkbox">
							<label>
								<span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										class="tabler:star-filled text-yellow-400"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="m8.243 7.34l-6.38.925l-.113.023a1 1 0 0 0-.44 1.684l4.622 4.499l-1.09 6.355l-.013.11a1 1 0 0 0 1.464.944l5.706-3l5.693 3l.1.046a1 1 0 0 0 1.352-1.1l-1.091-6.355l4.624-4.5l.078-.085a1 1 0 0 0-.633-1.62l-6.38-.926l-2.852-5.78a1 1 0 0 0-1.794 0z"
										/></svg
									>
								</span><input type="checkbox" bind:checked={filterIsTalent} />
							</label>
							<label>
								<span
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										class="tabler:star-filled text-primary-content"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="m8.243 7.34l-6.38.925l-.113.023a1 1 0 0 0-.44 1.684l4.622 4.499l-1.09 6.355l-.013.11a1 1 0 0 0 1.464.944l5.706-3l5.693 3l.1.046a1 1 0 0 0 1.352-1.1l-1.091-6.355l4.624-4.5l.078-.085a1 1 0 0 0-.633-1.62l-6.38-.926l-2.852-5.78a1 1 0 0 0-1.794 0z"
										/></svg
									></span
								><input type="checkbox" bind:checked={filterIsNotTalent} />
							</label>
						</div>
					</li>
				</ul>
			</details>
		</div>

		<div class="mt-4 grid content-start pt-4">
			<details open>
				<summary class="flex items-center"
					><h3 class="text-base-content/70 flex grow items-center gap-2 text-lg font-extrabold">
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
				<div class="border-l-base-300 text-base-content/70 ms-2 mt-2 border-l-4 ps-2 text-base font-medium">
					{#await newCounts}
						<span class="loading loading-spinner text-primary my-8"></span>
					{:then newCounts}
						<div class="justify-items-between grid grid-cols-4 ps-4 pt-4 pb-2">
							<div class="flex items-center justify-center gap-1.5">
								<div class="rounded bg-[#87bc45] p-0.5 px-1.5 font-bold text-white">A</div>
								<div class="animate-scale text-base-content flex items-center justify-center font-black">
									{newCounts.a}
								</div>
							</div>
							<div class="flex items-center justify-center gap-1.5">
								<div class="rounded bg-[#27aeef] p-0.5 px-1.5 font-bold text-white">B</div>
								<div class="animate-scale text-base-content flex items-center justify-center font-black">
									{newCounts.b}
								</div>
							</div>
							<div class="flex items-center justify-center gap-1.5">
								<div class="rounded bg-[#ef9b20] p-0.5 px-1.5 font-bold text-white">C</div>
								<div class="animate-scale text-base-content flex items-center justify-center font-black">
									{newCounts.cTotal}
								</div>
							</div>
							<div class="flex items-center justify-center gap-1.5">
								<div class="rounded bg-[#ea5545] p-0.5 px-1.5 font-bold text-white">D</div>
								<div class="animate-scale text-base-content flex items-center justify-center font-black">
									{newCounts.d}
								</div>
							</div>
						</div>
						{#key newCounts}
							<Chart figures={newCounts} />
						{/key}
					{/await}
				</div>
			</details>
		</div>

		<div class="mt-4 grid content-start gap-y-2 pt-4">
			<details>
				<summary class="flex items-center"
					><h3 class="text-base-content/70 mb-1 flex grow items-center gap-2 justify-self-start text-lg font-extrabold">
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
				<ul class="border-l-base-300 text-base-content/70 ms-2 border-l-4 ps-4 text-base font-medium">
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
	<div class="bg-base-100 w-120 rounded-lg lg:w-160">
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

<GenericModal bind:htmlElement={deleteSessionModal} title="Delete session">
	<p>Are you sure you want to delete these? You cannot undo this action.</p>
	<ul class="text-error mt-4 grid justify-items-center text-center font-bold">
		<li class="flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" class="tabler:circle-x" viewBox="0 0 24 24"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m7-2l4 4m0-4l-4 4"
				/></svg
			>Session data
		</li>
		<li class="flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" class="tabler:circle-x" viewBox="0 0 24 24"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m7-2l4 4m0-4l-4 4"
				/></svg
			>Records data
		</li>
	</ul>
	{#snippet actionButton()}
		<form method="POST" action="?/deleteSession" use:enhance>
			<button
				id="confirm-delete-session-button-clicked"
				class="btn btn-error text-base-100 min-w-24 rounded-full text-base"
				onclick={() => {
					deleteSessionButtonClickedSpinner = true;
				}}
				>{#key deleteSessionButtonClickedSpinner}
					{#if deleteSessionButtonClickedSpinner}
						<span class="loading loading-spinner absolute left-50"></span>
						<span class="invisible">Delete Session</span>
					{:else}
						<span>Delete Session</span>
					{/if}
				{/key}
			</button>
			<input type="hidden" name="session-id" value={data.session?.id} />
		</form>
	{/snippet}
</GenericModal>

{#key form}
	{#if form?.formRedirectFailed}
		<SingleToastBox status="error" message="No special characters, symbols, spaces!" />
	{/if}
{/key}
{#if form?.editLockedSuccess}
	<SingleToastBox status="success" message="Changed lock status!" />
{/if}
{#if form?.formSaveFail}
	<SingleToastBox status="error" message="Error saving!" />
{/if}
{#if form?.uploadSuccess}
	<SingleToastBox status="success" message="Uploaded successfully!" />
{/if}
{#if form?.editInsertSuccess}
	<SingleToastBox status="success" message="Edited successfully!" />
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

		&:not(:has(> input:checked)) {
			opacity: 50%;
		}
	}

	.custom-checkbox {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		column-gap: 0.75rem;
		row-gap: 0.5rem;
		flex-wrap: wrap;

		& > label {
			cursor: pointer;
			width: 100%;
			max-width: 2rem;
			max-height: 2rem;
			height: auto;

			& > span {
				width: 100%;
				height: 100%;

				display: inline-block;
				text-align: center;
				/* padding: 0.25rem 0.75rem 0.25rem 0.75rem; */
				border-radius: 10px;
				border: 2px solid transparent;
				&:has(+ input:checked) {
					background-color: rgba(169, 74, 74);
					color: #fdfdfd;
					font-weight: 700;
				}
				&:not(:has(+ input:checked)) {
					background-color: transparent;
					border: 2px solid rgba(169, 74, 74);
					color: rgba(169, 74, 74);
				}
				& > svg {
					display: inline;
				}
			}

			& > input[type='checkbox'] {
				display: none;
			}
		}
	}
</style>
