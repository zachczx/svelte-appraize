<script lang="ts">
	import { addToast, getToast } from '$lib/ToastBox.svelte';
	import { fade, slide } from 'svelte/transition';
</script>

<!-- <main class="grid w-full content-center justify-items-center">
	<div>
		<button
			class="btn btn-error"
			onclick={() => {
				addToast('error', 'This is the part where the sound breaks down!');
			}}>CLICK HERE</button
		>
		<button
			class="btn btn-success"
			onclick={() => {
				addToast('success', 'This succeeded man!');
			}}>CLICK HERE</button
		>
	</div>
</main> -->

{#if getToast().length > 0}
	<div class="relative grid content-center justify-items-center">
		<ul class="fixed left-1/2 top-1 grid w-full max-w-96 -translate-x-1/2 gap-2">
			{#each getToast() as message, i}
				<li
					class="flex items-center gap-4 rounded-xl {message.status === 'success'
						? 'bg-success text-success-content'
						: 'bg-error text-error-content'} px-4 py-2"
					in:slide={{ duration: 500, axis: 'y' }}
					out:fade={{ duration: 70 }}
				>
					<div>
						{#if message.status === 'success'}
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
					<div class="grow">{message.message}</div>
				</li>
			{/each}
		</ul>
	</div>
{/if}
