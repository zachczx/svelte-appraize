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

	/**
	 * @typedef {Object} edit - stores the uuid and a boolean value that is then switched upon clicking of edit button. Needs $state for reactivity, simple assignment didn't work after next170
	 * @property {string} id - entry's uuid from db
	 * @property {boolean} editStatus - switch to determine if edit form should be displayed
	 */
	let edit = $state([]);
	for (let i = 0; i < streamedResult.length; i++) {
		const key = streamedResult[i].id;
		edit[key] = false;
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
<div id="table" bind:this={sortableEl} class="relative grid space-y-4 px-2 md:px-10">
	<!-- {#if nothingFound}
		<div class="space-y-4 p-2 lg:px-10 lg:py-28">
			<div class="flex justify-center"><UndrawNoData /></div>
			<h2 class="text-center">Couldn't find anything that matches your filter!</h2>
		</div>
	{/if} -->

	{#key streamedResult}
		{#await streamedResult}
			<span class="ignore-elements loading loading-spinner loading-lg justify-self-center py-5 text-primary md:py-10"
			></span>
		{:then result}
			{#if nothingFound}
				<div class="space-y-12 p-2 lg:px-10 lg:py-28">
					<div class="flex justify-center"><UndrawEmpty /></div>
					<h2 class="text-center lg:text-4xl">There's nothing here!</h2>
				</div>
			{:else}
				{#each streamedResult as person, i}
					<div
						class="grid grid-cols-12 rounded-lg border border-gray-400 transition duration-700 ease-out hover:border-primary"
						id={person.id}
						data-sortable-id={person.id}
					>
						<div class="sortable-handle col-span-12 flex items-center lg:col-span-1">
							<div
								class="flex h-full grow items-center rounded-t-lg bg-base-300 p-2 text-base-content lg:grow-0 lg:rounded-l-lg lg:rounded-r-none lg:rounded-tl-lg"
							>
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

						{#if person.id && edit[person.id] === true}
							<div
								class="col-span-9 grid grid-cols-8 gap-4 border-x border-x-gray-400 bg-base-300 px-4 py-2"
								id="div__{person.id}"
								in:slide={{ duration: 500, axis: 'y', easing: circOut }}
								out:slide={{ duration: 10, axis: 'y', easing: circOut }}
							>
								<div class="col-span-8">
									<form method="POST" id="edit-form-{person.id}" action="?/edit" use:enhance>
										<input type="hidden" id="hidden-target" name="edit-target" value={person.id} />
									</form>
								</div>
								<div class="col-span-4">
									<label
										class="input input-bordered flex w-full items-center gap-2 border-gray-400 text-lg"
										for="edit-person-name-{person.id}"
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
											class="icon icon-tabler icons-tabler-outline icon-tabler-user me-2 inline"
											><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
												d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"
											/><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg
										>
										<EditFields
											name="edit-person-name"
											id="edit-person-name-{person.id}"
											form="edit-form-{person.id}"
											class="grow"
											value={person.name}
											placeholder="Name"
											onkeydown={(evt) => {
												editFormSubmitKeyboardShortcut(evt, `edit-form-${person.id}`);
											}}
										/></label
									>
								</div>

								<div class="col-span-4">
									<label
										class="input input-bordered flex w-full items-center items-center gap-2 border-gray-400 text-lg"
										for="edit-person-dept-{person.id}"
									>
										<Home class="me-2 flex-none" />
										<EditFields
											name="edit-person-dept"
											class="grow"
											form="edit-form-{person.id}"
											value={person.dept}
											id="edit-person-dept-{person.id}"
											placeholder="Dept"
											onkeydown={(evt) => {
												editFormSubmitKeyboardShortcut(evt, `edit-form-${person.id}`);
											}}
										/>
									</label>
								</div>
								<div class="col-span-8">
									<label
										class="textarea textarea-bordered flex h-24 w-full items-center items-center gap-2 border-gray-400 text-lg md:h-56"
										for="edit-person-remarks-{person.id}"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="1.5em"
											height="1.5em"
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
										<textarea
											form="edit-form-{person.id}"
											name="edit-person-remarks"
											id="edit-person-remarks-{person.id}"
											class="h-full w-full focus:outline-none"
											maxlength="999"
											placeholder="Remarks"
											value={person.remarks}
											onkeydown={(evt) => {
												editFormSubmitKeyboardShortcut(evt, `edit-form-${person.id}`);
											}}
										></textarea>
									</label>
								</div>
								<div class="col-span-6 bg-base-300 md:col-span-6">
									<button
										class="btn btn-primary join-item text-lg"
										form="edit-form-{person.id}"
										onclick={() => {
											edit[person.id] = false;
										}}
									>
										<TablerEdit class="inline h-[1em] w-[1em]" />Save
									</button>
								</div>
							</div>
						{:else}
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
									<div class="col-span-4 text-lg text-gray-500">{person.dept}</div>
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
						{/if}

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
												edit[person.id] = !edit[person.id];
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
					</div>
				{/each}
			{/if}
		{/await}
	{/key}
</div>
{#if !nothingFound}
	<form
		method="POST"
		action="?/save"
		class="ignore-from-sorting mx-10 mt-10 flex justify-center lg:justify-end"
		use:enhance
	>
		<input type="hidden" name="order" bind:value={order} />
		<input type="hidden" name="session-id" value={session.id} />
		<button class="btn btn-success flex items-center gap-2 font-bold lg:min-w-24">Save Changes</button>
	</form>
{/if}

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
