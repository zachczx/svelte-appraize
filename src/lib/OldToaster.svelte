<script lang="ts">
	import { circOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let { className = '', status, message } = $props();

	let fadeOut: boolean = $state(false);
	$effect(() => {
		setTimeout(() => {
			fadeOut = true;
		}, 3000);
	});
</script>

<div
	class="{fadeOut ? 'hidden' : undefined} fade-in fade-out toast toast-center toast-top transition duration-75 ease-out"
	in:slide={{ duration: 150, axis: 'x', easing: circOut }}
	out:slide={{ duration: 300, axis: 'x', easing: circOut }}
>
	<div
		class="alert flex justify-center gap-4 {status === 'success'
			? 'bg-success'
			: 'bg-error'} font-bold text-base-100 {className}"
	>
		<div>
			{#if status === 'success'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="2em"
					height="2em"
					class="tabler:circle-check-filled"
					viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34m-1.293 5.953a1 1 0 0 0-1.32-.083l-.094.083L11 12.585l-1.293-1.292l-.094-.083a1 1 0 0 0-1.403 1.403l.083.094l2 2l.094.083a1 1 0 0 0 1.226 0l.094-.083l4-4l.083-.094a1 1 0 0 0-.083-1.32"
					/></svg
				>{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="2em"
					height="2em"
					class="tabler:exclamation-circle-filled"
					viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M17 3.34A10 10 0 1 1 2 12l.005-.324A10 10 0 0 1 17 3.34M12 15a1 1 0 0 0-1 1v.01a1 1 0 0 0 2 0V16a1 1 0 0 0-1-1m0-7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1"
					/></svg
				>{/if}
		</div>
		<div class="grow">
			{message}
		</div>
	</div>
</div>
