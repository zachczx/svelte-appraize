<script>
	//import InsertNew from '$lib/InsertNew.svelte';
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import Trash from '$lib/svg/Trash.svelte';
	import { slide } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import UndrawEmpty from '$lib/svg/UndrawEmpty.svelte';
	import TablerEdit from '$lib/svg/TablerEdit.svelte';
	import EditFields from '$lib/EditFields.svelte';
	import GripVertical from '$lib/svg/GripVertical.svelte';
	let { data, form } = $props();
	let currentSaveIcon = $state('iconSave');
	let currentSaveButtonColor = $state('btn btn-primary');
	let nameData = $state();
	let deptData = $state();
	let gradeData = $state();
	let remarksData = $state();
	let helperText = $state(false);
	let helperTextButtonColor = $state('fill-primary');
	let deleteSessionButtonClickedSpinner = $state(false);
	let order = $state();
	const dragShadowClassesStart = ['ring', 'ring-1', 'ring-primary'];
	const dragShadowClassesMoving = ['ring', 'ring-1', 'ring-primary', 'shadow-md', 'shadow-neutral'];
	$effect(() => {
		console.log(order);
	});

	onMount(() => {
		//= document.getElementById('formNameData');
		// let deptData = document.getElementById('formDeptData');
		// let gradeData = document.getElementById('formGradeData');

		let el = document.getElementById('table');
		var sortable = new Sortable(el, {
			animation: 200,
			ghostClass: '.sortable-ghost', // Class name for the drop placeholder
			chosenClass: '.sortable-chosen', // Class name for the chosen item
			dragClass: '.sortable-drag', // Class name for the dragging item
			dataIdAttr: 'data-id',
			handle: '.sortable-handle',
			filter: '.ignore-elements',
			// auto scroll plugin
			scroll: true,
			forceAutoScrollFallback: false,
			scrollSensitivity: 70,
			scrollSpeed: 1,
			bubbleScroll: true,

			setData: function () {
				order = sortable.toArray();
			},

			onChoose: function (evt) {
				evt.item.classList.add(...dragShadowClassesStart);
			},
			onStart: function (evt) {
				order = sortable.toArray();
				evt.item.classList.add(...dragShadowClassesMoving);
			},

			onUnchoose: function (evt) {
				order = sortable.toArray();
				evt.item.classList.remove(...dragShadowClassesMoving);
			},
			onEnd: function (evt) {
				order = sortable.toArray();
				evt.item.classList.remove(...dragShadowClassesMoving);
			},
		});
		async function initArray() {
			await data.streamed.result;
			order = sortable.toArray();
		}
		initArray();
	});
</script>

<div class="space-y-12">
	<form
		method="POST"
		action="?/insert"
		class="flex flex-wrap gap-1 bg-purple-100 p-10 px-2 md:px-10"
		use:enhance
	>
		<label class="input input-bordered input-primary flex basis-1/2 items-center text-lg">
			{#if helperText}
				<div
					class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
					data-tip="Add a name"
				></div>
			{/if}
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
				class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus me-2"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
					d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"
				/><path d="M16 19h6" /><path d="M19 16v6" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4" /></svg
			>
			<input
				type="text"
				name="name"
				bind:value={nameData}
				class="grow text-lg"
				placeholder="Name"
				required
			/>
		</label>
		<label class="input input-bordered input-primary flex grow items-center text-lg">
			{#if helperText}
				<div
					class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
					data-tip="Add a department"
				></div>
			{/if}
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
				class="icon icon-tabler icons-tabler-outline icon-tabler-home-plus me-2"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
					d="M19 12h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h5.5"
				/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2" /><path d="M16 19h6" /><path
					d="M19 16v6"
				/></svg
			>
			<input
				type="text"
				name="dept"
				bind:value={deptData}
				class="grow text-lg"
				placeholder="Dept"
				required
			/>
		</label>

		<div class="flex items-center space-x-2 px-2 text-lg">
			<label class="label cursor-pointer space-x-1">
				<span class="label-text">A</span>
				<input
					type="radio"
					name="grade"
					value="A"
					class="radio-primary radio bg-base-100 checked:bg-primary"
					bind:group={gradeData}
				/>
			</label>
			<label class="label cursor-pointer space-x-1">
				<span class="label-text">B</span>
				<input
					type="radio"
					name="grade"
					class="radio-primary radio bg-base-100 checked:bg-primary"
					value="B"
					bind:group={gradeData}
				/>
			</label>
			{#if helperText}
				<div
					class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
					data-tip="Add a grade"
				></div>
			{/if}
			<label class="label cursor-pointer space-x-1">
				<span class="label-text">C</span>
				<input
					type="radio"
					name="grade"
					value="C"
					class="radio-primary radio bg-base-100 checked:bg-primary"
					bind:group={gradeData}
				/>
			</label>
			<label class="label cursor-pointer space-x-1">
				<span class="label-text">D</span>
				<input
					type="radio"
					value="D"
					name="grade"
					class="radio-primary radio bg-base-100 checked:bg-primary"
					bind:group={gradeData}
				/>
			</label>
		</div>
		<label class="input input-bordered input-primary flex grow items-center text-lg">
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
				class="icon icon-tabler icons-tabler-outline icon-tabler-message me-2"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 9h8" /><path
					d="M8 13h6"
				/><path
					d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"
				/></svg
			>
			{#if helperText}
				<div
					class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
					data-tip="Add remarks if you want"
				></div>
			{/if}<input
				type="text"
				name="remarks"
				bind:value={remarksData}
				class="grow text-lg"
				placeholder="Remarks (Optional)"
			/>
		</label>
		<button class="btn btn-primary text-lg font-bold"
			>Add <svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down inline"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg
			></button
		>
		{#if helperText}
			<div
				class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
				data-tip="Add an officer"
			></div>
		{/if}
	</form>
	<ol>
		<div class="flex px-2 pb-4 md:px-10">
			<h2 class="grow text-primary">
				Session: {data.id}
				{#if helperText}
					<div
						class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
						data-tip="This is your current session"
					></div>
				{/if}
			</h2>
			<div class="content-end justify-end font-bold">
				<button
					onclick={() => {
						helperText = !helperText;
						if (helperTextButtonColor === 'fill-primary') {
							helperTextButtonColor = 'fill-secondary';
						} else {
							helperTextButtonColor = 'fill-primary';
						}
					}}
					><h2>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.3em"
							height="1.3em"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="icon icon-tabler icons-tabler-filled icon-tabler-help-square-rounded inline {helperTextButtonColor}"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M12 2l.642 .005l.616 .017l.299 .013l.579 .034l.553 .046c4.687 .455 6.65 2.333 7.166 6.906l.03 .29l.046 .553l.041 .727l.006 .15l.017 .617l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.455 4.687 -2.333 6.65 -6.906 7.166l-.29 .03l-.553 .046l-.727 .041l-.15 .006l-.617 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.687 -.455 -6.65 -2.333 -7.166 -6.906l-.03 -.29l-.046 -.553l-.041 -.727l-.006 -.15l-.017 -.617l-.004 -.318v-.648l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.455 -4.687 2.333 -6.65 6.906 -7.166l.29 -.03l.553 -.046l.727 -.041l.15 -.006l.617 -.017c.21 -.003 .424 -.005 .642 -.005zm0 13a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1.368 -6.673a2.98 2.98 0 0 0 -3.631 .728a1 1 0 0 0 1.44 1.383l.171 -.18a.98 .98 0 0 1 1.11 -.15a1 1 0 0 1 -.34 1.886l-.232 .012a1 1 0 0 0 .111 1.994a3 3 0 0 0 1.371 -5.673z"
							/></svg
						>
					</h2>
				</button>
			</div>
		</div>
		<div id="table" class="relative grid space-y-4 px-2 md:px-10">
			{#await data.streamed.result}
				<span
					class="ignore-elements loading loading-spinner loading-lg justify-self-center py-5 text-primary md:py-10"
				></span>
			{:then result}
				{#if !result || result.length === 0}
					<div class="p-2 lg:p-5">
						<div class="flex justify-center"><UndrawEmpty /></div>
						<h2 class="text-center">There's nothing here!</h2>
					</div>
				{:else}
					{#each result as person}
						<div
							class="grid grid-cols-12 rounded-lg border border-slate-400 transition duration-700 ease-out hover:border-primary"
							data-id={person.uuid}
						>
							<div
								class="sortable-handle col-span-2 row-span-2 flex items-center md:col-span-1 md:row-span-1"
							>
								<div class="flex h-full items-center rounded-l-lg bg-primary p-2">
									{#if helperText}
										<div
											class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
											data-tip="Drag here"
										></div>
									{/if}
									<GripVertical class="stroke-base-100" />
								</div>
								<li class="ms-8 list-decimal ps-10 md:ms-12"></li>
							</div>
							<div class="col-span-5 p-2 md:col-span-4">
								{#if helperText}
									<div
										class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
										data-tip="Edit > Enter"
									></div>
								{/if}
								<EditFields
									name="name__{person.uuid}"
									id="name__{person.uuid}"
									form="edit-form-{person.uuid}"
									class="input input-sm input-primary w-full border-0 text-base"
									value={person.name}
									placeholder="Name"
								/>
							</div>
							<div class="col-span-5 p-2 md:col-span-3">
								{#if helperText}
									<div
										class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
										data-tip="Edit > Enter"
									></div>
								{/if}
								<EditFields
									name="dept__{person.uuid}"
									id="dept__{person.uuid}"
									form="edit-form-{person.uuid}"
									class="input input-sm input-primary w-full border-0 text-base"
									value={person.dept}
									placeholder="Dept"
								/>
							</div>
							<div class="col-span-5 p-2 md:col-span-2">
								{#if helperText}
									<div
										class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
										data-tip="Edit > Enter"
									></div>
								{/if}
								<EditFields
									name="grade__{person.uuid}"
									id="grade__{person.uuid}"
									form="edit-form-{person.uuid}"
									class="input input-sm input-primary w-full border-0 text-base"
									value={person.grade}
									placeholder="Grade"
								/>
							</div>
							<div class="col-span-5 flex justify-end p-2 md:col-span-2">
								<form
									method="POST"
									class="mx-3 self-center"
									id="edit-form-{person.uuid}"
									action="?/edit"
									use:enhance
								>
									{#if helperText}
										<div
											class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
											data-tip="Save"
										></div>
									{/if}
									<input type="hidden" id="hidden-target" name="edit-target" value={person.id} />
									<input type="hidden" id="hidden-edit-name-{person.uuid}" name="edit-name" />
									<input type="hidden" id="hidden-edit-dept-{person.uuid}" name="edit-dept" />
									<input type="hidden" id="hidden-edit-grade-{person.uuid}" name="edit-grade" />
									<button
										onclick={() => {
											let editNameValue = document.getElementById(`name__${person.uuid}`).value;
											let editDeptValue = document.getElementById(`dept__${person.uuid}`).value;
											let editGradeValue = document.getElementById(`grade__${person.uuid}`).value;
											console.log(editNameValue, editDeptValue, editGradeValue);
											let editNamePostToForm = document.getElementById(
												`hidden-edit-name-${person.uuid}`,
											);
											let editDeptPostToForm = document.getElementById(
												`hidden-edit-dept-${person.uuid}`,
											);
											let editGradePostToForm = document.getElementById(
												`hidden-edit-grade-${person.uuid}`,
											);
											editNamePostToForm.value = editNameValue;
											editDeptPostToForm.value = editDeptValue;
											editGradePostToForm.value = editGradeValue;
										}}><TablerEdit class="inline stroke-green-400" /></button
									>
								</form>
								<form method="POST" class="mx-3 self-center" action="?/delete" use:enhance>
									<input type="hidden" name="delete-target" value={person.id} />
									<button
										onclick={() => {
											let elDelete = document.getElementById(person.uuid);
											console.log(elDelete?.dataset.id);
											let cssTextFieldClasses = ['bg-secondary', 'translate-x-10', 'opacity-0'];
											elDelete?.classList.add(...cssTextFieldClasses);
										}}><Trash class="inline stroke-red-400" /></button
									>
									{#if helperText}
										<div
											class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
											data-tip="Delete"
										></div>
									{/if}
								</form>
							</div>
						</div>
					{/each}
				{/if}
			{/await}
		</div>
	</ol>
	<div class="flex space-x-4 px-2 pb-2 md:px-10 md:pb-10">
		<form class="grow" method="POST" action="?/save" use:enhance>
			<input type="hidden" name="order" value={order} />
			<button
				class={currentSaveButtonColor}
				onclick={() => {
					currentSaveIcon = 'iconSpinner';
					setTimeout(() => {
						if (form?.formSaveSuccess) {
							currentSaveIcon = 'iconSave';
							currentSaveButtonColor = 'btn btn-primary';
							form.formSaveSuccess = undefined;
						} else if (!form?.formSaveSuccess || form?.formSaveSuccess == null) {
							currentSaveIcon = 'iconError';
							currentSaveButtonColor = 'btn bg-red-600';
							setTimeout(() => {
								currentSaveIcon = 'iconSave';
								currentSaveButtonColor = 'btn btn-primary';
							}, 3000);
						}
					}, 5000);
				}}
			>
				{#key currentSaveIcon}
					{#if currentSaveIcon === 'iconSave' && (!form?.formSaveSuccess || form?.formSaveSuccess == null)}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="2em"
							height="2em"
							viewBox="0 0 24 24"
							fill="none"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy stroke-base-100"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"
							/><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path
								d="M14 4l0 4l-6 0l0 -4"
							/></svg
						>
					{:else if currentSaveIcon === 'iconSpinner' && (!form?.formSaveSuccess || form?.formSaveSuccess == null)}
						<span class="loading loading-spinner loading-md h-[2em] w-[2em] text-base-100"></span>
					{:else if currentSaveIcon === 'iconSpinner' && form?.formSaveSuccess}<svg
							xmlns="http://www.w3.org/2000/svg"
							width="2em"
							height="2em"
							viewBox="0 0 24 24"
							fill="none"
							stroke-width="4"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon icon-tabler icons-tabler-outline icon-tabler-check stroke-base-100 motion-safe:animate-wiggle"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M5 12l5 5l10 -10"
							/></svg
						>
					{:else if currentSaveIcon === 'iconError'}
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
							class="icon icon-tabler icons-tabler-outline icon-tabler-exclamation-circle stroke-base-100"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
							/><path d="M12 9v4" /><path d="M12 16v.01" /></svg
						>
					{/if}
				{/key}
				{#if helperText}
					<div
						class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
						data-tip="Save all changes above"
					></div>
				{/if}
			</button>
			{#key currentSaveIcon}
				{#if currentSaveIcon === 'iconSpinner' && form?.formSaveSuccess}
					<div class="fade-in fade-out toast toast-end transition duration-75 ease-out">
						<div class="alert flex justify-center bg-lime-500 font-bold text-base-100">
							Saved successfully!
						</div>
					</div>
				{:else if form?.formSaveFail}
					<div
						class="fade-in fade-out toast toast-end transition duration-75 ease-out"
						in:slide={{ duration: 150, axis: 'x', easing: circOut }}
						out:slide={{ duration: 300, axis: 'x', easing: circOut }}
					>
						<div class="alert flex justify-center bg-red-600 font-bold text-base-100">
							Error saving!
						</div>
					</div>
				{/if}
			{/key}
			{#key form}{#if form?.fail}
					<div class="fade-in fade-out toast toast-end transition duration-75 ease-out">
						<div class="alert flex justify-center bg-red-600 font-bold text-base-100">
							Failed to save, please try again later.
						</div>
					</div>
				{/if}
				{#if form?.editInsertSuccess}<div
						class="fade-in fade-out toast toast-end transition duration-75 ease-out"
					>
						<div class="alert flex justify-center bg-lime-500 font-bold text-base-100">
							Edited successfully!
						</div>
					</div>
				{:else if form?.editInsertFailedGrade}
					<div class="fade-in fade-out toast toast-end transition duration-75 ease-out">
						<div class="alert flex justify-center bg-red-600 font-bold text-base-100">
							Failed to edit! Grade should be a single alphabet (A, B, C, D)
						</div>
					</div>
				{/if}
			{/key}
		</form>
		<form class="content-end">
			<button
				class="btn bg-red-500 hover:bg-red-700"
				onclick={() => {
					delete_session_modal.showModal();
				}}
			>
				<Trash class="inline h-[2em] w-[2em] stroke-base-100" />
				{#if helperText}
					<div
						class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
						data-tip="Delete this session"
					></div>
				{/if}
			</button>
		</form>
	</div>
</div>

<dialog id="delete_session_modal" class="modal">
	<div class="rounded-lg bg-base-100">
		<h2 class="rounded-t-lg bg-red-500 p-5 font-bold text-base-100">Delete session</h2>
		<p class="px-4 py-4">
			Are you sure you want to <span class="font-bold">delete this session and all data</span>? You
			cannot undo this action.
		</p>
		<div class="modal-action flex justify-end p-4">
			<form method="dialog">
				<button class="btn btn-outline text-lg">Close</button>
			</form>
			<form method="POST" action="?/deleteSession" use:enhance>
				<button
					id="confirm-delete-session-button-clicked"
					class="btn min-w-40 bg-red-500 text-lg text-base-100 hover:bg-red-600"
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

<style>
	.sortable-handle {
		/* cursor: url('/hand-grab.svg'), auto; */
		cursor: move;
	}

	.modal {
		view-transition-name: modal;
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
</style>
