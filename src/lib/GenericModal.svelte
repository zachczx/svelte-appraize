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
		actionButton?: Snippet;
	}

	let { htmlElement = $bindable(), title, children, className, actionButton }: ModalProps = $props();
</script>

<dialog bind:this={htmlElement} class="view-upload-modal modal overflow-y-scroll {className}">
	<div class="bg-base-100 w-120 rounded-lg lg:w-160" id="dialog-el">
		<form method="dialog" class="grid justify-items-end p-2">
			<button aria-label="close" class="btn btn-ghost">
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

		<div class="grid gap-4 px-8 pt-2 pb-8">
			<h2 class="font-bold">{title}</h2>
			{#if children}
				<div class="">
					{@render children()}
				</div>
			{/if}
			<div class="flex items-center justify-end">
				<div class="modal-action flex items-center justify-end">
					<form method="dialog">
						<button class="btn btn-neutral min-w-24 rounded-full text-base">Close</button>
					</form>
					{#if actionButton}
						{@render actionButton()}
					{/if}
				</div>
			</div>
		</div>
	</div>
</dialog>
