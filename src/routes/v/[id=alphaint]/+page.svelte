<script>
	//import InsertNew from '$lib/InsertNew.svelte';
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
	import Trash from '$lib/svg/Trash.svelte';
	import { fade } from 'svelte/transition';
	import Spinner from '$lib/Spinner.svelte';
	let { data } = $props();
	let nameData = $state();
	let deptData = $state();
	let gradeData = $state();
	let order = $state();
	function saveOrder() {
		if (!order) {
			console.log('No movement yet');
		} else {
			console.log(order);
		}
	}
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

			onEnd: function (evt) {
				order = sortable.toArray();
			},
		});
	});
</script>

<div class="space-y-10">
	<form method="POST" action="?/insert" class="flex gap-1">
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
		<button class="btn btn-primary text-lg font-bold">Add</button>
	</form>
	<ol>
		<div id="table" class="relative grid space-y-4">
			{#await data.streamed.result}
				<Spinner />
			{:then result}
				{#each result as person}
					<div
						class="flex rounded-lg border border-slate-400 p-2 hover:border-primary hover:shadow active:shadow-primary"
						data-id={person.id}
					>
						<div class="basis-1/3">
							<li class="ms-8 list-decimal ps-10">{person.name}</li>
						</div>
						<div class="basis-1/3">{person.dept}</div>
						<div class="basis-1/3">{person.grade}</div>
						<form method="POST" action="?/delete">
							<input type="hidden" name="delete-target" value={person.id} />
							<button><Trash class="inline stroke-red-400" /></button>
						</form>
					</div>
				{/each}
			{/await}
		</div>
	</ol>
	<button class="btn btn-neutral" onclick={saveOrder}
		><svg
			xmlns="http://www.w3.org/2000/svg"
			width="2em"
			height="2em"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
			><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
				d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"
			/><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg
		></button
	>
</div>
<span class="sortable-drag sortable-chosen sortable-ghost hidden"></span>

<style>
	.sortable-chosen {
		border: 10px solid red !important ;
		color: red;
	}
	.sortable-drag {
		background-color: black !important ;
		border: 10px solid red !important ;
	}

	.sortable-ghost {
		background-color: black !important ;
		border: 10px solid red !important ;
		opacity: 1 !important ;
	}
</style>
