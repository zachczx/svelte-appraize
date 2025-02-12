<script lang="ts">
	import Sortable from 'sortablejs';
	import { onMount, tick } from 'svelte';
	import { enhance } from '$app/forms';
	import Trash from '$lib/svg/Trash.svelte';
	import { slide } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import UndrawEmpty from '$lib/svg/UndrawEmpty.svelte';
	import UndrawNoData from '$lib/svg/UndrawNoData.svelte';
	import TablerEdit from '$lib/svg/TablerEdit.svelte';
	import EditFields from '$lib/EditFields.svelte';
	import GripVertical from '$lib/svg/GripVertical.svelte';

	import User from '$lib/svg/User.svelte';
	import Home from '$lib/svg/Home.svelte';
	import { onNavigate } from '$app/navigation';
	import { editFormSubmitKeyboardShortcut } from '$lib/FormSubmitKeyboardShortcut';
	import Papa from 'papaparse';
	import DragDrop from '$lib/DragDrop.svelte';

	let { session, streamedResult = [], value = $bindable() } = $props();

	interface EditEntry {
		id: string;

		dialogElement?: HTMLDialogElement;
	}
	let edit: EditEntry[] = $state([]);
	for (let i = 0; i < streamedResult.length; i++) {
		const entry = {
			id: streamedResult[i].id,
			dialogElement: undefined,
		};
		edit.push(entry);
	}

	const dragShadowClassesStart = ['ring', 'ring-1', 'ring-primary'];
	const dragShadowClassesMoving = ['ring', 'ring-1', 'ring-primary', 'shadow-md', 'shadow-neutral'];

	let sortableEl: HTMLDivElement;

	let initOrder = '';
	let initOrderWantedlength = initOrder.length - 1;
	for (let i = 0; i < streamedResult.length; i++) {
		if (i === 0) {
			initOrder = String(streamedResult[i].id);
		} else {
			initOrder = initOrder + ',' + streamedResult[i].id;
		}
	}

	initOrder.slice(initOrderWantedlength);
	let order = $state(initOrder);

	let nothingFound = $state(false);

	onNavigate(() => {
		//reset the nothing found notice when soft navigating, cos new els dont have hidden css applied
		nothingFound = false;
	});

	$effect(() => {
		if (streamedResult.length === 0) {
			nothingFound = true;
		}

		let sortable = new Sortable(sortableEl, {
			animation: 300,
			ghostClass: '.sortable-ghost', // Class name for the drop placeholder
			chosenClass: '.sortable-chosen', // Class name for the chosen item
			dragClass: '.sortable-drag', // Class name for the dragging item
			dataIdAttr: 'data-sortable-id',
			handle: '.sortable-handle',
			filter: '.ignore-from-sorting',
			// auto scroll plugin
			scroll: true,
			forceAutoScrollFallback: false,
			scrollSensitivity: 70,
			scrollSpeed: 1,
			bubbleScroll: true,

			onChoose: function (evt) {
				evt.item.classList.add(...dragShadowClassesStart);
			},
			onStart: function (evt) {
				evt.item.classList.add(...dragShadowClassesMoving);
			},
			onUnchoose: function (evt) {
				evt.item.classList.remove(...dragShadowClassesMoving);
			},
			onEnd: async function (evt) {
				evt.item.classList.remove(...dragShadowClassesMoving);
				order = sortable.toArray().toString();
				value = order;
			},
		});
	});

	const isVisible: boolean[] = $state([]);

	let filterKeyword: string = $state('');
	let filterGrade: string = $state('Grade');
	let filterOthers: string = $state('Others');

	let filteredResults = $derived.by(() => {
		let filteredResults;
		filteredResults = streamedResult.filter((entry) => {
			if (filterKeyword.length > 0) {
				if (filterGrade.length > 0 && filterGrade !== 'All' && filterGrade !== 'Grade') {
					if (
						(entry.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
							entry.dept.toLowerCase().includes(filterKeyword.toLowerCase()) ||
							entry.remarks.toLowerCase().includes(filterKeyword.toLowerCase())) &&
						entry.grade === filterGrade
					) {
						return entry;
					}
				} else {
					if (
						entry.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
						entry.dept.toLowerCase().includes(filterKeyword.toLowerCase()) ||
						entry.remarks.toLowerCase().includes(filterKeyword.toLowerCase())
					) {
						return entry;
					}
				}
			}

			if (filterKeyword.length === 0) {
				if (filterGrade === 'All' || filterGrade === 'Grade') {
					return entry;
				}
				if (
					filterGrade === 'A' ||
					filterGrade === 'B' ||
					filterGrade === 'C+' ||
					filterGrade === 'C' ||
					filterGrade === 'C-' ||
					filterGrade === 'D'
				)
					return entry.grade === filterGrade;
			}
		});
		return filteredResults;
	});
</script>

<!-- {#if !nothingFound}
	<div class="mx-2 hidden grid-cols-12 rounded-lg pt-10 text-xl font-extrabold text-gray-500 md:mx-10 lg:grid">
		<div class="col-span-1"></div>
		<div class="col-span-1">Grade</div>
		<div class="col-span-4">Name</div>
		<div class="col-span-4">Dept</div>
		<div class="col-span-2"></div>
	</div>
{/if} -->
<div class="join flex">
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
		<input bind:value={filterKeyword} class="grow text-sm" placeholder="Filter by keyword" autocomplete="off" />
	</label>
	<select bind:value={filterGrade} class="join-item select select-bordered rounded-full text-base-content/70">
		<option disabled selected value="Grade">Grade</option>
		<option value="A">A</option>
		<option value="B">B</option>
		<option value="C+">C+</option>
		<option value="C">C</option>
		<option value="C-">C-</option>
		<option value="D">D</option>
		<option value="All">All</option>
	</select>
	<select bind:value={filterOthers} class="join-item select select-bordered rounded-full text-base-content/70">
		<option disabled selected value="Others">Others</option>
		<option value="Talent">Talent</option>
	</select>
</div>
<!-- <ul>
	{#each filteredResults as result}
		<li>{result.name} {result.grade}</li>
	{/each}
</ul> -->
<main>
	<div id="table" bind:this={sortableEl} class="relative grid">
		<!-- {#if nothingFound}
		<div class="space-y-4 p-2 lg:px-10 lg:py-28">
			<div class="flex justify-center"><UndrawNoData /></div>
			<h2 class="text-center">Couldn't find anything that matches your filter!</h2>
		</div>
	{/if} -->

		{#await filteredResults}
			<span class="ignore-elements loading loading-spinner loading-lg justify-self-center py-5 text-primary md:py-10"
			></span>
		{:then result}
			{#if nothingFound}
				<div class="space-y-12 p-2 lg:px-10 lg:py-28">
					<div class="flex justify-center"><UndrawEmpty /></div>
					<h2 class="text-center lg:text-4xl">There's nothing here!</h2>
				</div>
			{:else}
				{#each filteredResults as person, i}
					<div
						class="grid grid-cols-12 border-b-2 border-base-content/[0.07] py-2 last:border-0"
						id={person.id}
						data-sortable-id={person.id}
					>
						<div class="sortable-handle col-span-12 flex items-center lg:col-span-1">
							<div class="flex h-full grow items-center p-2 text-base-content lg:grow-0">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1em"
									height="1em"
									class="tabler:grip-vertical"
									viewBox="0 0 24 24"
									><path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 5a1 1 0 1 0 2 0a1 1 0 1 0-2 0m0 7a1 1 0 1 0 2 0a1 1 0 1 0-2 0m0 7a1 1 0 1 0 2 0a1 1 0 1 0-2 0m6-14a1 1 0 1 0 2 0a1 1 0 1 0-2 0m0 7a1 1 0 1 0 2 0a1 1 0 1 0-2 0m0 7a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
									/></svg
								>
							</div>
						</div>
						<div class="sortable-handle col-span-12 flex items-center justify-center lg:col-span-1">
							<!-- form="edit-form-{person.id}" name="grade__{person.id}"-->
							<form id="edit-grade-form-{person.id}" method="POST" action="?/editgrade" use:enhance>
								<input type="hidden" name="edit-grade-target" value={person.id} />
								<input type="hidden" name="edit-grade-target-name" value={person.name} />
								<select
									bind:value={person.grade}
									name="grade"
									id="grade__{person.id}"
									class="grade-selection select select-primary select-sm border-0 text-2xl font-extrabold"
									onchange={() => {
										const currentForm = document.getElementById(`edit-grade-form-${person.id}`);
										currentForm.requestSubmit ? currentForm.requestSubmit() : currentForm.submit();
										console.log('Form submitted!');
									}}
								>
									<option value="A">A</option>
									<option value="B">B</option>
									<option value="C+">C+</option>
									<option value="C">C</option>
									<option value="C-">C-</option>
									<option value="D">D</option>
								</select>
							</form>
						</div>

						<div class="col-span-12 self-center lg:col-span-9" id="div__{person.id}">
							<div class="grid grid-cols-8 items-center px-2 py-2">
								<div class="col-span-4 flex items-center gap-4 text-lg font-bold">
									{person.name}
									{#if person.remarks}
										<button
											aria-label="remarks"
											onclick={() => {
												console.log(i);
												if (isVisible[i]) {
													isVisible[i] = !isVisible[i];
													console.log(isVisible[i]);
													return;
												}
												isVisible[i] = true;
												console.log(isVisible[i]);
											}}
											><svg
												xmlns="http://www.w3.org/2000/svg"
												width="1em"
												height="1em"
												class="tabler:message-circle-exclamation"
												viewBox="0 0 24 24"
												><path
													fill="none"
													stroke="currentColor"
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15.02 19.52c-2.34.736-5 .606-7.32-.52L3 20l1.3-3.9C1.976 12.663 2.874 8.228 6.4 5.726c3.526-2.501 8.59-2.296 11.845.48c1.96 1.671 2.898 3.963 2.755 6.227M19 16v3m0 3v.01"
												/></svg
											>
										</button>
									{/if}
								</div>
								<div class="col-span-4 flex items-center text-lg text-gray-500">
									<div class="grow">{person.dept}</div>
									<form class="star flex items-center" method="post" action="?/toggleTalent" use:enhance>
										{#if !person.talent}
											<input type="hidden" name="talent" value="true" />
											<input type="hidden" name="record-id" value={person.id} />
											<button
												aria-label="talent"
												onclick={() => {
													console.log('clicked talent');
												}}
												class="group"
												><svg
													xmlns="http://www.w3.org/2000/svg"
													width="1.3em"
													height="1.3em"
													class="tabler:star text-base-content/50 group-hover:hidden"
													viewBox="0 0 24 24"
													><path
														fill="none"
														stroke="currentColor"
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
													/></svg
												>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="1.3em"
													height="1.3em"
													class="tabler:star-filled hidden text-yellow-400 group-hover:flex"
													viewBox="0 0 24 24"
													><path
														fill="currentColor"
														d="m8.243 7.34l-6.38.925l-.113.023a1 1 0 0 0-.44 1.684l4.622 4.499l-1.09 6.355l-.013.11a1 1 0 0 0 1.464.944l5.706-3l5.693 3l.1.046a1 1 0 0 0 1.352-1.1l-1.091-6.355l4.624-4.5l.078-.085a1 1 0 0 0-.633-1.62l-6.38-.926l-2.852-5.78a1 1 0 0 0-1.794 0z"
													/></svg
												>
											</button>
										{:else}
											<input type="hidden" name="talent" value="false" />
											<input type="hidden" name="record-id" value={person.id} />
											<button
												aria-label="normal"
												onclick={() => {
													console.log('clicked normal');
												}}
												><svg
													xmlns="http://www.w3.org/2000/svg"
													width="1.3em"
													height="1.3em"
													class="tabler:star-filled text-yellow-400"
													viewBox="0 0 24 24"
													><path
														fill="currentColor"
														d="m8.243 7.34l-6.38.925l-.113.023a1 1 0 0 0-.44 1.684l4.622 4.499l-1.09 6.355l-.013.11a1 1 0 0 0 1.464.944l5.706-3l5.693 3l.1.046a1 1 0 0 0 1.352-1.1l-1.091-6.355l4.624-4.5l.078-.085a1 1 0 0 0-.633-1.62l-6.38-.926l-2.852-5.78a1 1 0 0 0-1.794 0z"
													/></svg
												>
											</button>
										{/if}
									</form>
								</div>
								{#if person.remarks && isVisible[i]}
									<div
										class="col-span-8 mt-4 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-500"
										transition:slide={{ duration: 300, easing: circOut }}
									>
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
											class="icon icon-tabler icons-tabler-outline icon-tabler-message mb-1 me-2 inline"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M8 9h8" />
											<path d="M8 13h6" />
											<path
												d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"
											/>
										</svg>{person.remarks}
									</div>
								{/if}
							</div>
						</div>

						<!-- 
                    /////////////////////////////////////////
                    /
                    /
                    /
                    /
                    /	Edit/Save/Del panel
                    /
                    /
                    /	
                    /
                    ///////////////////////////////////////// 
                    -->
						<div class="col-span-12 flex items-center justify-end p-2 lg:col-span-1">
							<div class="dropdown dropdown-end">
								<div tabindex="0" role="button" class="hover:text-primary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										class="tabler:dots"
										viewBox="0 0 24 24"
										><path
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
										/></svg
									>
								</div>
								<ul tabindex="-1" class="menu dropdown-content z-[1] m-0 w-52 rounded-lg bg-base-100 p-0 shadow-lg">
									<li class="">
										<button
											class="flex items-center gap-2"
											onclick={() => {
												edit[i].dialogElement?.showModal();
												console.log(edit[i].dialogElement);
											}}
											><svg
												xmlns="http://www.w3.org/2000/svg"
												width="1.3em"
												height="1.3em"
												class="tabler:edit"
												viewBox="0 0 24 24"
												><g
													fill="none"
													stroke="currentColor"
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													><path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" /><path
														d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"
													/></g
												></svg
											>
											Edit
										</button>
									</li>
									<li>
										<button class="flex items-center gap-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="1.3em"
												height="1.3em"
												class="tabler:message-circle-plus"
												viewBox="0 0 24 24"
												><path
													fill="none"
													stroke="currentColor"
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12.007 19.98A9.9 9.9 0 0 1 7.7 19L3 20l1.3-3.9C1.976 12.663 2.874 8.228 6.4 5.726c3.526-2.501 8.59-2.296 11.845.48c1.992 1.7 2.93 4.04 2.747 6.34M16 19h6m-3-3v6"
												/></svg
											>Add Comment
										</button>
									</li>
									<li class="">
										<form method="POST" class="" action="?/delete" use:enhance>
											<input type="hidden" name="delete-target" value={person.id} />
											<button class="flex items-center gap-2"
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
										</form>
									</li>
								</ul>
							</div>
						</div>
						<dialog bind:this={edit[i].dialogElement} class="view-upload-modal modal overflow-y-scroll">
							<div class="w-[30rem] rounded-lg bg-base-100 lg:w-[40rem]">
								<form method="dialog" class="grid justify-items-end p-2">
									<button aria-label="close">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1.3em"
											height="1.3em"
											class="tabler:x"
											viewBox="0 0 24 24"
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
								<h2 class="px-8 py-2 font-bold">Edit Entry</h2>
								<form
									method="POST"
									id="edit-dialog-{person.id}"
									action="?/edit"
									class="grid gap-2 px-8 py-2"
									use:enhance
								>
									<label class="input input-bordered flex items-center gap-4">
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
											class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus hidden text-base-content/50 xl:flex"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
											<path d="M16 19h6" />
											<path d="M19 16v6" />
											<path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
										</svg>
										<input
											type="text"
											name="edit-name"
											value={person.name}
											class="shrink"
											placeholder="Name"
											autocomplete="off"
											required
										/>
									</label>

									<label class="input input-bordered flex items-center gap-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1em"
											height="1em"
											class="tabler:home hidden text-base-content/50 xl:flex"
											viewBox="0 0 24 24"
											><g
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												><path d="M5 12H3l9-9l9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /><path
													d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"
												/></g
											></svg
										>
										<input
											type="text"
											name="edit-dept"
											value={person.dept}
											class="grow"
											placeholder="Dept"
											autocomplete="off"
											required
										/>
									</label>

									<label class="input input-bordered flex w-full items-center border">
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
											class="icon icon-tabler icons-tabler-outline icon-tabler-message me-2 flex-none text-base-content/50"
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
											name="edit-remarks"
											value={person.remarks}
											class="grow"
											placeholder="Remarks (Optional)"
										/>
									</label>
									<input type="hidden" name="edit-session-id" value={session.id} />
									<input type="hidden" name="edit-record-id" value={person.id} />
								</form>
								<div class="grid grid-cols-2 gap-2 px-8 pb-8">
									<form method="dialog" class="">
										<button class="btn btn-outline btn-primary w-full text-lg text-primary-content" aria-label="close">
											Close
										</button>
									</form>
									<button
										form="edit-dialog-{person.id}"
										class="btn btn-primary text-lg font-bold text-primary-content"
										aria-label="Add">Edit</button
									>
								</div>
							</div>
						</dialog>
					</div>
				{/each}
			{/if}
		{/await}
	</div>
	{#if !nothingFound}
		<form
			method="POST"
			action="?/save"
			class="ignore-from-sorting mt-10 flex justify-center lg:justify-end"
			use:enhance
		>
			<input type="hidden" name="order" bind:value={order} />
			<input type="hidden" name="session-id" value={session.id} />
			<button class="btn btn-success flex items-center gap-2 text-lg font-bold lg:min-w-24">Save Changes</button>
		</form>
	{/if}
</main>

<style>
	.sortable-handle {
		cursor: move; /* fallback if grab cursor is unsupported */
		cursor: grab;
		cursor: -moz-grab;
		cursor: -webkit-grab;

		&:active {
			cursor: grabbing;
			cursor: -moz-grabbing;
			cursor: -webkit-grabbing;
		}
	}
</style>
