<script>
	//import InsertNew from '$lib/InsertNew.svelte';
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import Trash from '$lib/svg/Trash.svelte';
	import Stars from '$lib/svg/Stars.svelte';
	import IconoirStar from '$lib/svg/IconoirStar.svelte';
	import { slide, fly } from 'svelte/transition';
	import { page } from '$app/stores';
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

	let { data, form } = $props();
	let formSaveSession;
	let formAutoSaveSession = $state();
	let formSaveSuccessLoading = $state(false);
	let autoSave = $state(true);
	let submittedSpinner = $state(false);
	let nameData = $state();
	let deptData = $state();
	let gradeData = $state();
	let remarksData = $state();

	let buttonClickedStars = $state(false);
	let selectForm = $state();

	let deleteSessionButtonClickedSpinner = $state(false);
	let order = $state();
	const dragShadowClassesStart = ['ring', 'ring-1', 'ring-primary'];
	const dragShadowClassesMoving = ['ring', 'ring-1', 'ring-primary', 'shadow-md', 'shadow-neutral'];

	let filterInput = $state('');
	let filterNothingFound = $state(false);
	let filterGradeValue = $state('Grade');
	let filterForm;
	onNavigate(() => {
		//reset the nothing found notice when soft navigating, cos new els dont have hidden css applied
		filterNothingFound = false;
	});

	let newCounts = $derived.by(async () => {
		let newCounts = {
			a: 0,
			b: 0,
			c: 0,
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
			} else if (tempResult[i].grade === 'C') {
				newCounts.c += 1;
			} else if (tempResult[i].grade === 'D') {
				newCounts.d += 1;
			}
		}
		newCounts.total = newCounts.a + newCounts.b + newCounts.c + newCounts.d;
		// console.log(newCounts);
		if (newCounts.total == 0 || !newCounts.total) {
			newCounts.percentageA = newCounts.percentageB = newCounts.percentageC = newCounts.percentageD = 0;
		} else {
			newCounts.percentageA = Math.round((newCounts.a / newCounts.total) * 100);
			newCounts.percentageB = Math.round((newCounts.b / newCounts.total) * 100);
			newCounts.percentageC = Math.round((newCounts.c / newCounts.total) * 100);
			newCounts.percentageD = Math.round((newCounts.d / newCounts.total) * 100);
		}
		return newCounts;
	});

	onMount(() => {
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
	});

	$effect(() => {
		setInterval(() => {
			if (order && autoSave) {
				formAutoSaveSession.requestSubmit();
				console.log('Auto saved successfully');
				formSaveSuccessLoading = true;
				setTimeout(() => {
					formSaveSuccessLoading = false;
				}, 1500);
			}
		}, 120000);

		/* 		if (data.streamed.result) {
			const url = $page.url;
			if (url.searchParams.get('filter')) {
				filterResult('name', url.searchParams.get('filter'));
			}
		} */

		/* data.streamed.result.forEach((item) => {
			console.log(
				'ID: ',
				item.id,
				'\n',
				'UUID: ',
				item.uuid,
				'\n',
				'Name: ',
				item.name,
				'\n',
				'Dept: ',
				item.dept,
				'\n',
				'Grade: ',
				item.grade,
				'\n',
			);
		}); */
	});
</script>

<div class="grid grid-cols-4">
	<div class="col-span-1 border-b-2 border-r-2 border-gray-200 bg-gray-50 py-4 pe-4 ps-5 text-2xl">
		<h1 class="view-header font-black text-primary">
			<a href="/">Appraize</a>
		</h1>
	</div>
	<div class="col-span-3 flex items-center border-b-2 border-b-gray-200 bg-gray-50 px-8">
		<form method="POST" id="view-top-navbar-input" action="?/redirect" class="flex w-full justify-center" use:enhance>
			<label
				class="view-input input input-bordered relative flex w-full max-w-[30rem] self-center rounded-full border-gray-400 text-lg"
				for="session"
			>
				<input
					type="text"
					name="session"
					placeholder="Jump to another session"
					class="w-full"
					onkeydown={(evt) => {
						editFormSubmitKeyboardShortcut(evt, 'view-top-navbar-input');
					}}
					required
				/>
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
					</div>{/if}{/key}
		</form>
	</div>
	<!-- Sidebar -->
	<div class="view-outline border-r-2 border-gray-200 bg-gray-50 py-4 pb-4 text-2xl">
		<div class="view-home-sidebar space-y-10">
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
					>Grade Distribution
				</h3>
				{#await newCounts}
					<span class="loading loading-spinner loading-lg block justify-self-center text-primary"></span>
				{:then newCounts}
					<div class="ms-7 border-l-2 border-gray-200 pe-8 ps-7">
						<div class="grid w-full grid-cols-4 gap-2 pt-4">
							<div class="grid place-items-center rounded-lg border border-gray-400 bg-base-200 shadow">
								<div class="justify-self-start rounded-br-lg rounded-tl-lg bg-neutral px-2 text-start text-base-100">
									A
								</div>
								<div class="animate-scale text-4xl font-black">
									{newCounts.a}
								</div>
								<div class="animate-scale text-lg font-bold text-gray-500">{newCounts.percentageA}%</div>
							</div>
							<div class="grid place-items-center rounded-lg border border-gray-400 bg-base-200 shadow">
								<div class="justify-self-start rounded-br-lg rounded-tl-lg bg-neutral px-2 text-start text-base-100">
									B
								</div>
								<div class="animate-scale text-4xl font-black">
									{newCounts.b}
								</div>
								<div class="animate-scale text-lg font-bold text-gray-500">{newCounts.percentageB}%</div>
							</div>
							<div class="grid place-items-center rounded-lg border border-gray-400 bg-base-200 shadow">
								<div class="justify-self-start rounded-br-lg rounded-tl-lg bg-neutral px-2 text-start text-base-100">
									C
								</div>
								<div class="animate-scale text-4xl font-black">
									{newCounts.c}
								</div>
								<div class="animate-scale text-lg font-bold text-gray-500">{newCounts.percentageC}%</div>
							</div>
							<div class="grid place-items-center rounded-lg border border-gray-400 bg-base-200 shadow">
								<div class="justify-self-start rounded-br-lg rounded-tl-lg bg-neutral px-2 text-start text-base-100">
									D
								</div>
								<div class="animate-scale text-4xl font-black">
									{newCounts.d}
								</div>
								<div class="animate-scale text-lg font-bold text-gray-500">{newCounts.percentageD}%</div>
							</div>
						</div>
					</div>
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
					>Add Officer
				</h3>
				<div class="me-4 ms-7 w-auto border-l-2 border-gray-200">
					<form method="POST" id="insert-form" action="?/insert" class="ms-4 space-y-1 rounded-lg p-4" use:enhance>
						{#if form?.insertNameMissing}<span class="text-lg text-error">Please enter a name:</span>{/if}
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
								class="shrink text-lg"
								placeholder="Name"
								onkeydown={(evt) => {
									editFormSubmitKeyboardShortcut(evt, 'insert-form');
								}}
								required
							/>
						</label>
						{#if form?.insertDeptMissing}<span class="text-lg text-error">Please enter a dept:</span>{/if}
						<label class="border-1 input input-bordered input-primary flex w-full items-center border-gray-400 text-lg">
							<Home class="me-2 flex-none" />
							<input
								type="text"
								name="dept"
								bind:value={deptData}
								class="grow text-lg"
								placeholder="Dept"
								onkeydown={(evt) => {
									editFormSubmitKeyboardShortcut(evt, 'insert-form');
								}}
								required
							/>
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

							<input
								type="text"
								name="remarks"
								bind:value={remarksData}
								class="grow text-lg"
								placeholder="Remarks (Optional)"
								onkeydown={(evt) => {
									editFormSubmitKeyboardShortcut(evt, 'insert-form');
								}}
							/>
						</label>
						<button
							class="btn btn-primary relative w-full text-xl font-bold text-base-100"
							onclick={() => {
								// buttonClickedStars = !buttonClickedStars;
								// setTimeout(() => {
								// 	buttonClickedStars = !buttonClickedStars;
								// }, 2000);
							}}
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
					</form>
				</div>
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
			<div class="view-upload-sidebar">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-table-plus mb-1 me-4 inline"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
							d="M12.5 21h-7.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5"
						/><path d="M3 10h18" /><path d="M10 3v18" /><path d="M16 19h6" /><path d="M19 16v6" /></svg
					>Add Multiple
				</h3>
				<div class="me-4 ms-7 w-auto border-l-2 border-gray-200">
					<ol class="p-4">
						<li class="list-none">
							<button
								class="btn btn-ghost text-xl"
								onclick={() => {
									upload_modal.showModal();
								}}
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
									class="icon icon-tabler icons-tabler-outline icon-tabler-upload mb-1 me-2 inline"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
										d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"
									/><path d="M7 9l5 -5l5 5" /><path d="M12 4l0 12" /></svg
								>Upload from file (.csv)</button
							>
						</li>
					</ol>
				</div>
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
				<div class="ms-7 w-auto space-y-4 border-l-2 border-gray-200 pe-4 pt-4">
					<div class="join grid grid-cols-2 pe-4 ps-8">
						<form method="POST" action="?/save" bind:this={formSaveSession} use:enhance>
							<button
								class="btn btn-primary join-item w-full font-bold text-base-100"
								onclick={() => {
									formSaveSuccessLoading = true;
									setTimeout(() => {
										formSaveSuccessLoading = false;
									}, 1500);
								}}
							>
								{#if formSaveSuccessLoading}
									<span class="loading loading-spinner text-base-100"></span>
								{:else}
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
									</svg><span class="text-xl">Save</span>{/if}</button
							>
							<input type="hidden" name="order" value={order} />
						</form>
						<button
							class="group btn btn-outline join-item btn-neutral w-full"
							onclick={() => {
								delete_session_modal.showModal();
							}}
						>
							<Trash class="inline h-[2em] w-[2em] stroke-neutral group-hover:stroke-base-100" /><span
								class="ms-0 hidden text-xl font-bold lg:contents">Delete</span
							>
						</button>
					</div>
					<div class="flex items-center pe-4 ps-8">
						<input
							type="checkbox"
							id="auto-save-checkbox"
							class="checkbox-primary checkbox me-2"
							bind:checked={autoSave}
						/>
						<label for="auto-save-checkbox" class="text-lg font-medium">Auto save progress</label>

						{#if formSaveSuccessLoading}
							<span class="loading loading-dots loading-sm ms-2 self-end text-primary"></span>
						{/if}

						<form method="POST" action="?/save" bind:this={formAutoSaveSession} use:enhance>
							<!-- <button class="hidden"></button> -->
							<input type="hidden" name="order" value={order} />
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

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

	<!-- {#if form?.fail}
	<div class="fade-in fade-out toast toast-end transition duration-75 ease-out">
	<div class="alert flex justify-center bg-error font-bold text-base-100">
	Failed to save, please try again later.
	</div>
	</div>
	{/if}  -->
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
				Failed to edit! Grade should be a single alphabet (A, B, C, D)
			</div>
		</div>
	{/if}
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
	<div class="col-span-3 min-h-dvh space-y-12 pb-4 pt-4">
		<div>
			<ol class="view-content space-y-4">
				<div class="view-ranking-title space-y-2 px-4 pb-4 md:px-10">
					<h1>Ranking: {data.id}</h1>
					<div class="flex items-center text-2xl text-gray-500">
						<div class="grow">
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
								class="icon icon-tabler icons-tabler-outline icon-tabler-users mb-1 me-2 inline"
								><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
									d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"
								/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path
									d="M21 21v-2a4 4 0 0 0 -3 -3.85"
								/></svg
							>{#await newCounts}
								<span class="loading loading-spinner loading-sm text-primary"></span>
							{:then newCounts}
								<span class="animate-scale font-extrabold">{newCounts.total}</span>
							{/await}
						</div>
						<a href="/v/{data.id}" class="inline-block self-center text-lg">
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
							</svg>Reset
						</a>
						<form
							method="POST"
							action="?/filter"
							id="filter-input"
							bind:this={filterForm}
							class="join ms-4 flex justify-start rounded-lg"
							use:enhance
						>
							<label
								class="border-1 input-neutral input join-item input-bordered flex items-center border-gray-400 text-lg"
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
									class="icon icon-tabler icons-tabler-outline icon-tabler-filter me-2 inline"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path
										d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"
									/>
								</svg>
								<input type="text" name="filter" class="grow text-lg" placeholder="Filter by keywords" />
							</label>
							<select
								id="filter-grade"
								name="grade"
								class="select-neutral join-item select select-bordered border-gray-400 text-lg"
								bind:value={filterGradeValue}
								onchange={() => {
									filterForm.requestSubmit();
								}}
							>
								<option disabled selected>Grade</option>
								<option>A</option>
								<option>B</option>
								<option>C</option>
								<option>D</option>
								<option>All</option>
							</select>
							<button class="btn join-item btn-neutral text-xl font-bold text-base-100">Filter</button>
						</form>
					</div>
				</div>
				<div class="mx-2 grid grid-cols-12 rounded-lg pt-10 text-xl font-extrabold text-gray-500 md:mx-10">
					<div class="col-span-1"></div>
					<div class="col-span-1">Grade</div>
					<div class="col-span-4">Name</div>
					<div class="col-span-4">Dept</div>
					<div class="col-span-2"></div>
				</div>
				<div id="table" class="relative grid space-y-4 px-2 md:px-10">
					{#if filterNothingFound}
						<div class="space-y-4 p-2 lg:px-10 lg:py-28">
							<div class="flex justify-center"><UndrawNoData /></div>
							<h2 class="text-center">Couldn't find anything that matches your filter!</h2>
						</div>
					{/if}

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
									class="grid grid-cols-12 rounded-lg border border-gray-400 transition duration-700 ease-out hover:border-primary"
									id={person.uuid}
									data-sortable-id={person.uuid}
								>
									<div class="sortable-handle col-span-1 flex items-center">
										<div class="flex h-full items-center rounded-l-lg bg-neutral p-2">
											<GripVertical class="stroke-base-100" />
										</div>
									</div>
									<div class="sortable-handle col-span-1 flex items-center">
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
												<option value="C">C</option>
												<option value="D">D</option>
											</select>
										</form>
									</div>
									{#if person.edit}
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
												<button class="btn join-item btn-neutral text-lg" form="edit-form-{person.uuid}">
													<TablerEdit class="inline h-[1em] w-[1em]" />Save
												</button>
											</div>
										</div>
									{:else}
										<div class="col-span-8 self-center" id="div__{person.uuid}">
											<div class="grid grid-cols-8 items-center py-2">
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
									<div class="col-span-2 flex justify-end p-2">
										<div class="join self-center">
											<button
												class="btn join-item text-lg {person.edit ? 'btn-neutral' : 'btn-outline btn-neutral'}"
												onclick={() => {
													if (!person.edit) {
														person.edit = true;
													} else if (person.edit == true || person.edit == false) {
														person.edit = !person.edit;
													}
													console.log(person.edit);
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
												<ul tabindex="0" class="menu dropdown-content z-[1] m-0 w-52 rounded-lg bg-base-100 p-0 shadow">
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
				</div>
			</ol>
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
<dialog id="upload_modal" class="view-upload-modal modal">
	<div class="w-[30rem] rounded-lg bg-base-100 lg:w-[40rem]">
		<h2 class="rounded-t-lg bg-primary p-5 font-bold text-base-100">Add Multiple Officers</h2>

		<div class="p-4">
			<form id="form-fileupload" enctype="multipart/form-data" method="POST">
				<label for="fileupload" class="text-lg">Upload your file (.csv):</label>
				<input
					type="file"
					name="fileupload"
					accept=".csv"
					class="file-input file-input-bordered file-input-primary w-full"
				/>
			</form>
			<div class="mt-8">CSV file must have these columns, for example:</div>
			<div class="grid grid-cols-4 rounded-lg border border-gray-400 text-gray-400">
				<div class="rounded-tl-lg border-b border-r border-b-gray-400 border-r-gray-400 bg-base-200 p-2 font-bold">
					Name
				</div>
				<div class="border-b border-r border-b-gray-400 border-r-gray-400 bg-base-200 p-2 font-bold">Dept</div>
				<div class="border-b border-r border-b-gray-400 border-r-gray-400 bg-base-200 p-2 font-bold">
					Grade (A/B/C/D)
				</div>
				<div class="rounded-tr-lg border-b border-b-gray-400 bg-base-200 p-2 font-bold">Remarks</div>

				<div class="border-r border-r-gray-400 p-2">Mary</div>
				<div class="border-r border-r-gray-400 p-2">Sue</div>
				<div class="border-r border-r-gray-400 p-2">B</div>
				<div class="p-2">She was hardworking.</div>
			</div>
		</div>

		<div class="modal-action flex justify-end px-4 pb-4">
			<form method="dialog">
				<button class="btn btn-outline text-lg">Close</button>
			</form>
			<button form="form-fileupload" class="btn btn-primary text-lg font-bold">Upload</button>
		</div>
	</div>
</dialog>

<dialog id="delete_session_modal" class="delete-session-modal">
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
	.view-outline {
		view-transition-name: view-outline;
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
	.view-upload-sidebar {
		view-transition-name: view-upload-sidebar;
	}
	.view-manage-sidebar {
		view-transition-name: view-manage-sidebar;
	}
	.view-input {
		view-transition-name: view-input;
	}

	.view-content {
		view-transition-name: view-content;
	}

	.sortable-handle {
		/* cursor: url('/hand-grab.svg'), auto; */
		cursor: move;
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
