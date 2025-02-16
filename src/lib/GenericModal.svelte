<script lang="ts">
	import { type Snippet } from 'svelte';

	/**
	 * @typedef ModalProps
	 * @prop {string} className - Additional css utility classes to insert into main dialog element
	 */
	interface ModalProps {
		htmlElement: HTMLDialogElement;
		title: string;
		children?: Snippet;
		className?: string;
	}

	let { htmlElement = $bindable(), title, children, className }: ModalProps = $props();
</script>

<dialog bind:this={htmlElement} class="view-upload-modal modal overflow-y-scroll {className}">
	<div class="w-[30rem] rounded-lg bg-base-100 lg:w-[40rem]" id="dialog-el">
		<form method="dialog" class="grid justify-items-end p-2">
			<button aria-label="close">
				<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" class="tabler:x" viewBox="0 0 24 24"
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

		<h2 class="px-8 pt-4 font-bold">{title}</h2>
		{#if children}
			<div class="px-8 py-4">
				{@render children()}
			</div>
		{/if}
		<div class="modal-action flex justify-end p-4">
			<form method="dialog">
				<button class="btn btn-neutral btn-sm">Close</button>
			</form>
		</div>
	</div>
</dialog>
