<script>
	//import InsertNew from '$lib/InsertNew.svelte';
	import Sortable from 'sortablejs';
	import { onMount, tick } from 'svelte';
	import { enhance } from '$app/forms';
	import Trash from '$lib/svg/Trash.svelte';
	import { slide } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import Spinner from '$lib/Spinner.svelte';
	import UndrawEmpty from '$lib/svg/UndrawEmpty.svelte';
	import TablerEdit from '$lib/svg/TablerEdit.svelte';
	let { data, form } = $props();
	let nameData = $state();
	let deptData = $state();
	let gradeData = $state();
	let order = $state();
	let buttonColor = $state('btn btn-neutral');
	let disableSaveButton = $state(true);
	/* $effect(() => {
		console.log(disableSaveButton);
		console.log(order);
		console.log(buttonColor);
	}); */

	onMount(() => {
		//= document.getElementById('formNameData');
		// let deptData = document.getElementById('formDeptData');
		// let gradeData = document.getElementById('formGradeData');
		let el = document.getElementById('table');
		var sortable = new Sortable(el, {
			animation: 250,
			easing: 'cubic-bezier(1, 0, 0, 1)',
			ghostClass: 'sortable-ghost', // Class name for the drop placeholder
			chosenClass: 'sortable-chosen', // Class name for the chosen item
			dragClass: 'sortable-drag', // Class name for the dragging item
			dataIdAttr: 'data-id',
			handle: '.sortable-handle',

			onUnchoose: function (evt) {
				order = sortable.toArray();
			},
			onEnd: function (evt) {
				order = sortable.toArray();
				disableSaveButton = false;
			},
		});
		order = sortable.toArray();
	});
</script>

<div class="space-y-12">
	<form method="POST" action="?/insert" class="flex gap-1" use:enhance>
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
				class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus me-2"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
					d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"
				/><path d="M16 19h6" /><path d="M19 16v6" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4" /></svg
			>
			<input
				type="text"
				name="name"
				id="name"
				bind:value={nameData}
				class="grow text-lg"
				placeholder="Name"
				required
			/>
		</label>
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
				id="dept"
				bind:value={deptData}
				class="grow text-lg"
				placeholder="Dept"
				required
			/>
		</label>
		<select
			class="select select-primary flex items-center gap-2 text-lg"
			name="grade"
			bind:value={gradeData}
			id="grade"
			required
		>
			<option>A</option>
			<option>B</option>
			<option selected="selected">C</option>
			<option>D</option>
		</select>
		<button
			class="btn btn-primary text-lg font-bold"
			onclick={() => {
				disableSaveButton = false;
			}}>Add</button
		>
	</form>
	<ol>
		<div id="table" class="relative grid space-y-4">
			{#await data.streamed.result}
				<Spinner />
			{:then result}
				{#if !result || result.length === 0}
					<div class="p-2 lg:p-5">
						<div class="flex justify-center"><UndrawEmpty /></div>
						<h2 class="text-center">There's nothing here!</h2>
					</div>
				{:else}
					{#each result as person}
						<div
							class="flex rounded-lg border border-slate-400 hover:border-primary hover:shadow active:shadow-primary"
							data-id={person.uuid}
						>
							<div class="sortable-handle basis-1/3 p-2">
								<li class="ms-8 list-decimal ps-10">{person.name}</li>
							</div>
							<div class="sortable-handle basis-1/3 p-2">{person.dept}</div>
							<div class="sortable-handle basis-1/3 p-2">{person.grade}</div>
							<div class="flex p-2">
								<button class="mx-5 self-center"><TablerEdit class="stroke-green-400" /></button>
								<form method="POST" class="self-center" action="?/delete">
									<input type="hidden" name="delete-target" value={person.id} />
									<button><Trash class="inline stroke-red-400" /></button>
								</form>
							</div>
						</div>
					{/each}
				{/if}
			{/await}
		</div>
	</ol>
	<form method="POST" action="?/save" class="flex" use:enhance>
		<input type="hidden" name="order" value={order} />
		<button
			class={buttonColor}
			onclick={() => {
				buttonColor = 'btn btn-neutral spin';
				disableSaveButton = true;
				setTimeout(() => {
					buttonColor = 'btn bg-lime-500';
					disableSaveButton = false;
				}, 1000);
				setTimeout(() => {
					buttonColor = 'btn btn-neutral';
					disableSaveButton = true;
				}, 4000);
			}}
			disabled={disableSaveButton}
		>
			{#key buttonColor}
				{#if buttonColor === 'btn btn-neutral spin'}
					<span class="loading loading-spinner loading-md h-[2em] w-[2em] text-base-100"></span>
				{:else if buttonColor === 'btn bg-lime-500'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="2em"
						height="2em"
						viewBox="0 0 24 24"
						fill="none"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="icon icon-tabler icons-tabler-outline icon-tabler-check stroke-base-100"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg
					>
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy stroke-base-100"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
							d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"
						/><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path
							d="M14 4l0 4l-6 0l0 -4"
						/></svg
					>{/if}{/key}</button
		>{#if buttonColor === 'btn bg-lime-500'}<span
				class="ms-4 inline-block self-center font-bold"
				in:slide={{ duration: 150, axis: 'x', easing: circOut }}
				out:slide={{ duration: 300, axis: 'x', easing: circOut }}>Saved!</span
			>{/if}
	</form>
</div>

<style>
	.sortable-handle {
		cursor: url('/hand-grab.svg'), auto;
	}
</style>
