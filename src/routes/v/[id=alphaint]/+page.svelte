<script>
	//import InsertNew from '$lib/InsertNew.svelte';
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import Trash from '$lib/svg/Trash.svelte';
	import Stars from '$lib/svg/Stars.svelte';
	import IconoirStar from '$lib/svg/IconoirStar.svelte';
	import { fly, slide, fade } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import UndrawEmpty from '$lib/svg/UndrawEmpty.svelte';
	import TablerEdit from '$lib/svg/TablerEdit.svelte';
	import EditFields from '$lib/EditFields.svelte';
	import GripVertical from '$lib/svg/GripVertical.svelte';
	import User from '$lib/svg/User.svelte';
	import Home from '$lib/svg/Home.svelte';
	import { navigating } from '$app/stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	let { data, form } = $props();
	let submittedSpinner = $state(false);
	let currentSaveIcon = $state('iconSave');
	let currentSaveButtonColor = $state('btn-primary');
	let nameData = $state();
	let deptData = $state();
	let gradeData = $state();
	let remarksData = $state();
	// let helperText = $state(false);
	let buttonClickedStars = $state(false);
	let selectForm = $state();
	// let helperTextButtonColor = $state('fill-primary');
	let deleteSessionButtonClickedSpinner = $state(false);
	let order = $state();
	const dragShadowClassesStart = ['ring', 'ring-1', 'ring-primary'];
	const dragShadowClassesMoving = ['ring', 'ring-1', 'ring-primary', 'shadow-md', 'shadow-neutral'];
	/* 	$effect(() => {
		console.log(form?.formRedirectFailed);
	}); */
	let countGradeA = $state(0);
	let countGradeB = $state(0);
	let countGradeC = $state(0);
	let countGradeD = $state(0);
	let countGradeTotal = $derived(countGradeA + countGradeB + countGradeC + countGradeD);
	let gradeSelection = $state();

	onMount(() => {
		//= document.getElementById('formNameData');
		// let deptData = document.getElementById('formDeptData');
		// let gradeData = document.getElementById('formGradeData');

		let el = document.getElementById('table');
		var sortable = new Sortable(el, {
			animation: 300,
			ghostClass: '.sortable-ghost', // Class name for the drop placeholder
			chosenClass: '.sortable-chosen', // Class name for the chosen item
			dragClass: '.sortable-drag', // Class name for the dragging item
			dataIdAttr: 'data-sortable-id',
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

		async function countNumberGrades() {
			await data.streamed.result;
			gradeSelection = document.getElementsByClassName('grade-selection');

			for (let i = 0; i < gradeSelection.length; i++) {
				let val = gradeSelection[i].value;
				switch (val) {
					case 'A':
						countGradeA += 1;
						break;
					case 'B':
						countGradeB += 1;
						break;
					case 'C':
						countGradeC += 1;
						break;
					default:
						countGradeD += 1;
						break;
				}
			}
		}

		countNumberGrades();
	});
</script>

<div class="grid grid-cols-4">
	<div class="sticky top-0 col-span-1 border-b-2 border-r-2 border-gray-100 bg-gray-50 py-4 pe-4 ps-5 text-2xl">
		<h1 class="view-header font-black text-primary">
			<a href="/">Appraize</a>
		</h1>
	</div>
	<div class="col-span-3 flex px-8 pt-4">
		<form method="POST" action="?/redirect" class=" flex w-full justify-center" use:enhance>
			<label
				class="view-input input input-bordered relative flex w-full max-w-[30rem] self-center rounded-full border-gray-400 text-lg"
				for="session"
			>
				<input type="text" name="session" placeholder="Jump to another session" class="w-full" required />
				<button class="view-input-button group absolute -top-0 right-1">
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
						>{/if}
				</button>
			</label>
			{#key form}{#if form?.formRedirectFailed}
					<div
						class="fade-in fade-out toast toast-end transition duration-75 ease-out"
						in:slide={{ duration: 150, axis: 'x', easing: circOut }}
						out:slide={{ duration: 300, axis: 'x', easing: circOut }}
					>
						<div class="alert flex justify-center bg-error font-bold text-base-100">
							No special characters, symbols, spaces!
						</div>
					</div>{/if}{/key}
		</form>

		<!-- <div class="inline content-center justify-end font-bold">
			<button
				onclick={() => {
					helperText = !helperText;
					if (helperTextButtonColor === 'fill-neutral') {
						helperTextButtonColor = 'fill-secondary';
					} else {
						helperTextButtonColor = 'fill-neutral';
					}
				}}
				><h2>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.5em"
						height="1.5em"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="icon icon-tabler icons-tabler-filled icon-tabler-help-square-rounded inline {helperTextButtonColor}"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
							d="M12 2l.642 .005l.616 .017l.299 .013l.579 .034l.553 .046c4.687 .455 6.65 2.333 7.166 6.906l.03 .29l.046 .553l.041 .727l.006 .15l.017 .617l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.455 4.687 -2.333 6.65 -6.906 7.166l-.29 .03l-.553 .046l-.727 .041l-.15 .006l-.617 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.687 -.455 -6.65 -2.333 -7.166 -6.906l-.03 -.29l-.046 -.553l-.041 -.727l-.006 -.15l-.017 -.617l-.004 -.318v-.648l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.455 -4.687 2.333 -6.65 6.906 -7.166l.29 -.03l.553 -.046l.727 -.041l.15 -.006l.617 -.017c.21 -.003 .424 -.005 .642 -.005zm0 13a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1.368 -6.673a2.98 2.98 0 0 0 -3.631 .728a1 1 0 0 0 1.44 1.383l.171 -.18a.98 .98 0 0 1 1.11 -.15a1 1 0 0 1 -.34 1.886l-.232 .012a1 1 0 0 0 .111 1.994a3 3 0 0 0 1.371 -5.673z"
						/></svg
					>
				</h2>
			</button>
		</div> -->
	</div>
	<!-- Sidebar -->
	<div class="border-r-2 border-gray-100 bg-gray-50 py-4 pb-4 text-2xl">
		<div class="view-home-sidebar sticky top-20 space-y-4">
			<div>
				<h3 class="px-4 font-extrabold">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-home mb-1 me-4 inline"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M5 12l-2 0l9 -9l9 9l-2 0" />
						<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
						<path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
					</svg><a href="/">Home</a>
				</h3>
			</div>

			<div class="view-summary-sidebar grid">
				<h3 class="px-4 font-extrabold">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-file-analytics mb-1 me-4 inline"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path
							d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"
						/><path d="M9 17l0 -5" /><path d="M12 17l0 -1" /><path d="M15 17l0 -3" /></svg
					>Summary
				</h3>

				{#await data.streamed.result}
					<span class="loading loading-spinner loading-lg block justify-self-center text-primary"></span>
				{:then}
					{#key form?.formInsertSuccess}
						<ul class="ms-7 border-l-2 border-gray-200 ps-4">
							<li>
								<button class="btn btn-ghost"
									><span class="text-2xl">A:</span><span class="inline-block animate-scale px-2 text-2xl font-black"
										>{countGradeA}</span
									></button
								>
							</li>
							<li>
								<button class="btn btn-ghost">
									<span class="text-2xl">B:</span><span class="inline-block animate-scale px-2 text-2xl font-black"
										>{countGradeB}</span
									></button
								>
							</li>
							<li>
								<button class="btn btn-ghost"
									><span class="text-2xl">C:</span><span class="inline-block animate-scale px-2 text-2xl font-black"
										>{countGradeC}</span
									></button
								>
							</li>
							<li>
								<button class="btn btn-ghost"
									><span class="text-2xl">D:</span><span class="inline-block animate-scale px-2 text-2xl font-black"
										>{countGradeD}</span
									></button
								>
							</li>
							<li>
								<button class="btn btn-ghost"
									><span class="text-2xl">Total:</span><span class="inline-block animate-scale px-2 text-2xl font-black"
										>{countGradeTotal}</span
									></button
								>
							</li>
						</ul>
					{/key}
				{/await}
			</div>

			<div class="view-add-sidebar">
				<h3 class="px-4 font-extrabold">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-square-rounded-plus mb-1 me-4 inline"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
							d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"
						/><path d="M15 12h-6" /><path d="M12 9v6" /></svg
					>Add Someone
				</h3>
				<div class="me-4 ms-7 w-auto border-l-2 border-gray-200">
					<form method="POST" action="?/insert" class="ms-4 space-y-1 rounded-lg p-4" use:enhance>
						{#if form?.insertNameMissing}<span class="text-lg text-error">Please enter a name:</span>{/if}
						<label class="border-1 input input-bordered input-primary flex w-full items-center border-gray-400 text-lg">
							<!-- {#if helperText}
								<div class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold" data-tip="Add a name"></div>
							{/if} -->
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
							<input type="text" name="name" bind:value={nameData} class="shrink text-lg" placeholder="Name" required />
						</label>
						{#if form?.insertDeptMissing}<span class="text-lg text-error">Please enter a dept:</span>{/if}
						<label class="border-1 input input-bordered input-primary flex w-full items-center border-gray-400 text-lg">
							<!-- {#if helperText}
								<div
									class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
									data-tip="Add a department"
								></div>
							{/if} -->
							<Home class="me-2 flex-none" />
							<input type="text" name="dept" bind:value={deptData} class="grow text-lg" placeholder="Dept" required />
						</label>
						{#if form?.insertGradeMissing}<span class="text-lg text-error">Please select a grade:</span>{/if}
						<div class="grid grid-cols-4 items-center justify-items-start text-lg">
							<label class="label cursor-pointer space-x-1">
								<span class="label-text text-lg font-medium">A</span>
								<input
									type="radio"
									name="grade"
									value="A"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									bind:group={gradeData}
								/>
							</label>
							<label class="label cursor-pointer space-x-1">
								<span class="label-text text-lg font-medium">B</span>
								<input
									type="radio"
									name="grade"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									value="B"
									bind:group={gradeData}
								/>
							</label>

							<!-- {#if helperText}
								<div class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold" data-tip="Add a grade"></div>
							{/if} -->
							<label class="label cursor-pointer space-x-1">
								<span class="label-text text-lg font-medium">C</span>
								<input
									type="radio"
									name="grade"
									value="C"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									bind:group={gradeData}
								/>
							</label>
							<label class="label cursor-pointer space-x-1">
								<span class="label-text text-lg font-medium">D</span>
								<input
									type="radio"
									value="D"
									name="grade"
									class="radio border-gray-400 bg-base-100 checked:bg-primary"
									bind:group={gradeData}
								/>
							</label>
						</div>

						<label class="border-1 input input-bordered input-primary flex w-full items-center border-gray-400 text-lg">
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
							<!-- {#if helperText}
								<div
									class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
									data-tip="Add remarks if you want"
								></div>
							{/if} -->
							<input
								type="text"
								name="remarks"
								bind:value={remarksData}
								class="grow text-lg"
								placeholder="Remarks (Optional)"
							/>
						</label>
						<button
							class="btn btn-primary relative w-full text-lg font-bold text-base-100"
							onclick={() => {
								// buttonClickedStars = !buttonClickedStars;
								// setTimeout(() => {
								// 	buttonClickedStars = !buttonClickedStars;
								// }, 2000);
							}}
							>Add <svg
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

							<!-- {#if buttonClickedStars}
					<div transition:fade={{ duration: 200, delay: 500 }} class="absolute -right-2 -top-2 block">
						<IconoirStar
							class="h-[1.5em] w-[1.5em] overflow-visible stroke-orange-200 text-orange-300"
						/>
					</div>
					<IconoirStar
						class="absolute -bottom-4 -left-1 h-[2em] w-[2em] overflow-visible stroke-gray-300 text-yellow-200 transition delay-100"
					/>
					<IconoirStar
						class="absolute -right-2 top-5 h-[1em] w-[1em] overflow-visible stroke-gray-300 text-yellow-200 transition delay-150 duration-500 ease-out"
					/>
					<IconoirStar
						class="absolute -bottom-1 right-4 h-[1.5em] w-[1.5em] overflow-visible stroke-teal-300 text-lime-300 transition delay-200 duration-500 ease-out"
					/>
					<IconoirStar
						class="absolute -left-4 -top-1 h-[1.5em] w-[1.5em] overflow-visible stroke-pink-300 text-error transition delay-300 duration-500 ease-out"
					/>
				{/if} -->
						</button>
						<!-- {#if helperText}
							<div class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold" data-tip="Add an officer"></div>
						{/if} -->
					</form>
				</div>
			</div>
			<div class="view-manage-sidebar">
				<h3 class="px-4 font-extrabold">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-settings mb-1 me-4 inline"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path
							d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
						/>
						<path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
					</svg>Manage Session
				</h3>
				<div class="ms-7 w-auto border-l-2 border-gray-200 pe-4 pt-4">
					<div class="join grid grid-cols-2 pe-4 ps-8">
						<form method="POST" action="?/save" use:enhance>
							<button
								class="btn join-item w-full {currentSaveButtonColor}"
								onclick={() => {
									currentSaveIcon = 'iconSpinner';
									setTimeout(() => {
										if (form?.formSaveSuccess) {
											currentSaveIcon = 'iconSave';
											currentSaveButtonColor = 'btn-primary';
											form.formSaveSuccess = undefined;
										} else if (!form?.formSaveSuccess || form?.formSaveSuccess == null) {
											currentSaveIcon = 'iconError';
											currentSaveButtonColor = 'btn-error';
											setTimeout(() => {
												currentSaveIcon = 'iconSave';
												currentSaveButtonColor = 'btn-primary';
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
											class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy motion-safe:animate-wiggle stroke-base-100"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
											<path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
											<path d="M14 4l0 4l-6 0l0 -4" />
										</svg>
										<!-- <span class="text-lg font-bold text-base-100"></span> -->
									{:else if currentSaveIcon === 'iconSpinner' && (!form?.formSaveSuccess || form?.formSaveSuccess == null)}
										<span class="loading loading-spinner loading-md h-[2em] w-[2em] text-base-100"></span>
									{:else if currentSaveIcon === 'iconSpinner' && form?.formSaveSuccess}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1.5em"
											height="1.5em"
											viewBox="0 0 24 24"
											fill="none"
											stroke-width="4"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="icon icon-tabler icons-tabler-outline icon-tabler-check motion-safe:animate-wiggle stroke-base-100"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M5 12l5 5l10 -10" />
										</svg>
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
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
											<path d="M12 9v4" />
											<path d="M12 16v.01" /></svg
										>
									{/if}
								{/key}
								<!-- {#if helperText}
									<div
										class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
										data-tip="Save all changes above"
									></div>
								{/if} -->
							</button><input type="hidden" name="order" value={order} />
							{#key currentSaveIcon}
								{#if currentSaveIcon === 'iconSpinner' && form?.formSaveSuccess}
									<div class="fade-in fade-out toast toast-end transition duration-75 ease-out">
										<div class="alert flex justify-center bg-lime-500 font-bold text-base-100">Saved successfully!</div>
									</div>
								{:else if form?.formSaveFail}
									<div
										class="fade-in fade-out toast toast-end transition duration-75 ease-out"
										in:slide={{ duration: 150, axis: 'x', easing: circOut }}
										out:slide={{ duration: 300, axis: 'x', easing: circOut }}
									>
										<div class="alert flex justify-center bg-error font-bold text-base-100">Error saving!</div>
									</div>
								{/if}
							{/key}
							{#key form}{#if form?.fail}
									<div class="fade-in fade-out toast toast-end transition duration-75 ease-out">
										<div class="alert flex justify-center bg-error font-bold text-base-100">
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
										<div class="alert flex justify-center bg-error font-bold text-base-100">
											Failed to edit! Grade should be a single alphabet (A, B, C, D)
										</div>
									</div>
								{/if}
							{/key}
						</form>
						<button
							class="group btn btn-outline join-item btn-neutral w-full"
							onclick={() => {
								delete_session_modal.showModal();
							}}
						>
							<Trash class="inline h-[2em] w-[2em] stroke-neutral group-hover:stroke-base-100" />

							<!-- {#if helperText}
								<div
									class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
									data-tip="Delete this session"
								></div>
							{/if} -->
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="col-span-3 min-h-dvh space-y-12 pb-4 pt-4">
		<div>
			<ol>
				<div class="view-ranking-title px-2 pb-4 md:px-10">
					<h1>Ranking</h1>
					<div class="text-2xl">
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
							class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-list mb-1 me-2 inline"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
							/><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path
								d="M9 12l.01 0"
							/><path d="M13 12l2 0" /><path d="M9 16l.01 0" /><path d="M13 16l2 0" /></svg
						>{data.id}
					</div>
				</div>
				<div id="table" class="relative grid space-y-4 px-2 md:px-10">
					{#await data.streamed.result}
						<span
							class="ignore-elements loading loading-spinner loading-lg justify-self-center py-5 text-primary md:py-10"
						></span>
					{:then result}
						{#if !result || result.length === 0}
							<div class="p-2 lg:px-10 lg:py-28">
								<div class="flex justify-center"><UndrawEmpty /></div>
								<h2 class="text-center">There's nothing here!</h2>
							</div>
						{:else}
							{#each result as person}
								<div
									class="grid grid-cols-12 rounded-lg border border-slate-400 transition duration-700 ease-out hover:border-primary"
									id={person.uuid}
									data-sortable-id={person.uuid}
								>
									<div
										class="sortable-handle col-span-2 row-span-2 flex items-center space-x-2 md:col-span-2 md:row-span-1"
									>
										<div class="flex h-full items-center rounded-l-lg bg-neutral p-2">
											<!-- {#if helperText}
												<div
													class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
													data-tip="Drag here"
												></div>
											{/if} -->
											<GripVertical class="stroke-base-100" />
										</div>
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
													gradeSelection = document.getElementsByClassName('grade-selection');
													countGradeA = countGradeB = countGradeC = countGradeD = 0;
													for (let i = 0; i < gradeSelection.length; i++) {
														let val = gradeSelection[i].value;
														switch (val) {
															case 'A':
																countGradeA += 1;
																break;
															case 'B':
																countGradeB += 1;
																break;
															case 'C':
																countGradeC += 1;
																break;
															default:
																countGradeD += 1;
																break;
														}
													}
												}}
											>
												<option value="A">A</option>
												<option value="B">B</option>
												<option value="C">C</option>
												<option value="D">D</option>
											</select>
										</form>
										<!-- {#if helperText}
											<div
												class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
												data-tip="Select grade"
											></div>
										{/if} -->
										<!-- <li class="ms-8 list-decimal ps-10 md:ms-12"></li> -->
									</div>
									<div class="col-span-5 grid space-y-3 p-2 md:col-span-4">
										<!-- {#if helperText}
												<div
													class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
													data-tip="Edit > Enter"
												></div>
											{/if} -->
										<label class="input input-sm input-primary flex items-center border-0 text-2xl font-bold">
											<EditFields
												name="name__{person.uuid}"
												id="name__{person.uuid}"
												form="edit-form-{person.uuid}"
												class="grow "
												value={person.name}
												placeholder="Name"
											/>
										</label>

										<!-- {#if helperText}
												<div
													class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
													data-tip="Edit > Enter"
												></div>
											{/if} -->
										<label class="input input-sm input-primary flex items-center border-0 text-xl">
											<EditFields
												name="dept__{person.uuid}"
												id="dept__{person.uuid}"
												form="edit-form-{person.uuid}"
												class="grow"
												value={person.dept}
												placeholder="Dept"
											/>
										</label>
									</div>
									<div class="col-span-5 grid p-2 md:col-span-4">
										<div>{person.remarks}</div>
									</div>

									<div class="col-span-5 flex justify-end p-2 md:col-span-2">
										<form
											method="POST"
											class="mx-3 self-center"
											id="edit-form-{person.uuid}"
											action="?/edit"
											use:enhance
										>
											<!-- {#if helperText}
												<div class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold" data-tip="Save"></div>
											{/if} -->
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
													let editNamePostToForm = document.getElementById(`hidden-edit-name-${person.uuid}`);
													let editDeptPostToForm = document.getElementById(`hidden-edit-dept-${person.uuid}`);
													let editGradePostToForm = document.getElementById(`hidden-edit-grade-${person.uuid}`);
													editNamePostToForm.value = editNameValue;
													editDeptPostToForm.value = editDeptValue;
													editGradePostToForm.value = editGradeValue;
												}}
												><TablerEdit class="inline h-[1.5em] w-[1.5em] stroke-green-400" />
											</button>
										</form>
										<form method="POST" class="mx-3 self-center" action="?/delete" use:enhance>
											<input type="hidden" name="delete-target" value={person.id} />
											<button
												onclick={() => {
													let elDelete = document.getElementById(person.uuid);
													console.log(elDelete?.dataset.deleteId);
													let cssTextFieldClasses = ['bg-secondary', 'translate-x-10', 'opacity-0'];
													elDelete?.classList.add(...cssTextFieldClasses);
												}}
												><Trash class="inline h-[1.5em] w-[1.5em] stroke-error" />
											</button>
											<!-- {#if helperText}
												<div
													class="tooltip tooltip-top tooltip-open tooltip-secondary font-bold"
													data-tip="Delete"
												></div>
											{/if} -->
										</form>
									</div>
								</div>
							{/each}
						{/if}
					{/await}
				</div>
			</ol>
		</div>
		<div class="col-span-3 px-4 pb-4 pt-4 text-center">Copyright © 2024 Zixian Chen. All rights reserved.</div>
	</div>
</div>

<dialog id="delete_session_modal" class="modal">
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

<style>
	.view-header {
		view-transition-name: view-header;
	}

	.view-home-sidebar {
		view-transition-name: view-home-sidebar;
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
	.view-manage-sidebar {
		view-transition-name: view-manage-sidebar;
	}
	.view-input {
		view-transition-name: view-input;
	}

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

	.a-icon::before {
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
	}
</style>
