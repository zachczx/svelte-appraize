<script>
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

	let { streamedResult = [], value = $bindable() } = $props();

	/**
	 * @typedef {Object} edit - stores the uuid and a boolean value that is then switched upon clicking of edit button. Needs $state for reactivity, simple assignment didn't work after next170
	 * @property {string} uuid - entry's uuid from db
	 * @property {boolean} editStatus - switch to determine if edit form should be displayed
	 */
	let edit = $state({});
	for (let i = 0; i < streamedResult.length; i++) {
		const key = streamedResult[i].uuid;
		edit[key] = false;
	}

	const dragShadowClassesStart = ['ring', 'ring-1', 'ring-primary'];
	const dragShadowClassesMoving = ['ring', 'ring-1', 'ring-primary', 'shadow-md', 'shadow-neutral'];

	let sortableEl;

	let initOrder = '';
	let initOrderWantedlength = initOrder.length - 1;
	for (let i = 0; i < streamedResult.length; i++) {
		if (i === 0) {
			initOrder = String(streamedResult[i].uuid);
		} else {
			initOrder = initOrder + ',' + streamedResult[i].uuid;
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
</script>

{#if !nothingFound}
	<div class="mx-2 hidden grid-cols-12 rounded-lg pt-10 text-xl font-extrabold text-gray-500 md:mx-10 lg:grid">
		<div class="col-span-1"></div>
		<div class="col-span-1">Grade</div>
		<div class="col-span-4">Name</div>
		<div class="col-span-4">Dept</div>
		<div class="col-span-2"></div>
	</div>
{/if}
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
				{#each streamedResult as person}
					<div
						class="grid grid-cols-12 rounded-lg border border-gray-400 transition duration-700 ease-out hover:border-primary"
						id={person.uuid}
						data-sortable-id={person.uuid}
					>
						<div class="sortable-handle col-span-12 flex items-center lg:col-span-1">
							<div
								class="flex h-full grow items-center rounded-t-lg bg-neutral p-2 lg:grow-0 lg:rounded-l-lg lg:rounded-r-none lg:rounded-tl-lg"
							>
								<GripVertical class="stroke-base-100" />
							</div>
						</div>
						<div class="sortable-handle col-span-12 flex items-center justify-center lg:col-span-1">
							<!-- form="edit-form-{person.uuid}" name="grade__{person.uuid}"-->
							<form id="edit-grade-form-{person.uuid}" method="POST" action="?/editgrade" use:enhance>
								<input type="hidden" name="edit-grade-target" value={person.id} />
								<input type="hidden" name="edit-grade-target-name" value={person.name} />
								<select
									bind:value={person.grade}
									name="grade"
									id="grade__{person.uuid}"
									class="grade-selection select select-primary select-sm border-0 text-2xl font-extrabold"
									onchange={() => {
										const currentForm = document.getElementById(`edit-grade-form-${person.uuid}`);
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

						{#if person.uuid && edit[person.uuid] === true}
							<div
								class="col-span-8 grid grid-cols-8 gap-4 border-x border-x-gray-400 bg-base-300 px-4 py-2"
								id="div__{person.uuid}"
								in:slide={{ duration: 500, axis: 'y', easing: circOut }}
								out:slide={{ duration: 10, axis: 'y', easing: circOut }}
							>
								<div class="col-span-8">
									<form method="POST" id="edit-form-{person.uuid}" action="?/edit" use:enhance>
										<input type="hidden" id="hidden-target" name="edit-target" value={person.id} />
									</form>
								</div>
								<div class="col-span-4">
									<label
										class="input input-bordered flex w-full items-center items-center gap-2 border-gray-400 text-lg"
										for="edit-person-name-{person.uuid}"
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
											id="edit-person-name-{person.uuid}"
											form="edit-form-{person.uuid}"
											class="grow"
											value={person.name}
											placeholder="Name"
											onkeydown={(evt) => {
												editFormSubmitKeyboardShortcut(evt, `edit-form-${person.uuid}`);
											}}
										/></label
									>
								</div>

								<div class="col-span-4">
									<label
										class="input input-bordered flex w-full items-center items-center gap-2 border-gray-400 text-lg"
										for="edit-person-dept-{person.uuid}"
									>
										<Home class="me-2 flex-none" />
										<EditFields
											name="edit-person-dept"
											class="grow"
											form="edit-form-{person.uuid}"
											value={person.dept}
											id="edit-person-dept-{person.uuid}"
											placeholder="Dept"
											onkeydown={(evt) => {
												editFormSubmitKeyboardShortcut(evt, `edit-form-${person.uuid}`);
											}}
										/>
									</label>
								</div>
								<div class="col-span-8">
									<label
										class="textarea textarea-bordered flex h-24 w-full items-center items-center gap-2 border-gray-400 text-lg md:h-56"
										for="edit-person-remarks-{person.uuid}"
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
											form="edit-form-{person.uuid}"
											name="edit-person-remarks"
											id="edit-person-remarks-{person.uuid}"
											class="h-full w-full focus:outline-none"
											maxlength="999"
											placeholder="Remarks"
											value={person.remarks}
											onkeydown={(evt) => {
												editFormSubmitKeyboardShortcut(evt, `edit-form-${person.uuid}`);
											}}
										></textarea>
									</label>
								</div>
								<div class="col-span-6 bg-base-300 md:col-span-6">
									<button
										class="btn join-item btn-neutral text-lg"
										form="edit-form-{person.uuid}"
										onclick={() => {
											edit[person.uuid] = false;
										}}
									>
										<TablerEdit class="inline h-[1em] w-[1em]" />Save
									</button>
								</div>
							</div>
						{:else}
							<div class="col-span-12 self-center lg:col-span-8" id="div__{person.uuid}">
								<div class="grid grid-cols-8 items-center px-2 py-2">
									<div class="col-span-4 text-2xl font-bold">{person.name}</div>
									<div class="col-span-4 text-2xl text-gray-500">{person.dept}</div>
									{#if person.remarks}
										<div class="col-span-8 mt-4 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-500">
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
						<div class="col-span-12 flex justify-end p-2 lg:col-span-2">
							<div class="join self-center">
								<button
									class="btn join-item text-lg {edit ? 'btn-neutral' : 'btn-outline btn-neutral'}"
									onclick={() => {
										edit[person.uuid] = !edit[person.uuid];
									}}
									><TablerEdit class="inline h-[1.5em] w-[1.5em]" />
								</button>
								<div class="btn dropdown dropdown-end btn-outline join-item btn-neutral">
									<div tabindex="0" role="button" class="m-0 flex h-full items-center text-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1.2em"
											height="1.2em"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"
											><path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M6 9l6 6l6 -6" />
										</svg>
									</div>
									<ul tabindex="-1" class="menu dropdown-content z-[1] m-0 w-52 rounded-lg bg-base-100 p-0 shadow">
										<li class="">
											<form
												method="POST"
												class="group m-0 w-full justify-center self-center rounded-lg border-2 border-error stroke-error p-0 hover:border-red-700 hover:bg-error hover:stroke-base-100"
												action="?/delete"
												use:enhance
											>
												<input type="hidden" name="delete-target" value={person.id} />
												<button
													class="px-1 py-2 text-lg font-bold text-error group-hover:text-base-100"
													onclick={() => {
														let elDelete = document.getElementById(person.uuid);
														console.log(elDelete);
														let cssTextFieldClasses = ['bg-base-300', 'translate-x-10', 'opacity-0'];
														elDelete?.classList.add(...cssTextFieldClasses);
													}}
													><Trash class="mb-1 inline h-[1.5em] w-[1.5em]" /> Delete this entry
												</button>
											</form>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		{/await}
	{/key}
</div>
{#if !nothingFound}
	<form method="POST" action="?/save" class="ignore-from-sorting mx-10 mt-10 flex justify-center lg:justify-end">
		<input type="hidden" name="order" bind:value={order} />
		<button class="btn btn-primary btn-lg w-full text-xl font-bold lg:w-1/3 lg:min-w-24 lg:max-w-96"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="1.5em"
				height="1.5em"
				viewBox="0 0 24 24"
				fill="none"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy motion-safe:animate-wiggle me-1 stroke-base-100"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
				<path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
				<path d="M14 4l0 4l-6 0l0 -4" />
			</svg><span class="hidden text-2xl 2xl:contents">Save</span></button
		>
	</form>
{/if}

<style>
	.sortable-handle {
		/* cursor: url('/hand-grab.svg'), auto; */
		cursor: move;
	}
</style>
