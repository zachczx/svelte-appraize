<script lang="ts">
	import { enhance } from '$app/forms';
	import { stopDefaultEvents } from '$lib/utils';
	import type { Props } from 'svelte-motion/types/types';

	let { session }: Props = $props();
	let formUploadButtonSpinner = $state(false);
	let formFileUpload: HTMLFormElement;
	let formFileUploadInput: HTMLInputElement;
	let formFileUploadFilename: string = $state('');
	let formFileUploadLabelColor: boolean = $state(false);
</script>

<h2 class="px-8 py-2 font-bold">Upload File</h2>
<div class="px-8 py-8">
	<form
		id="form-fileupload"
		bind:this={formFileUpload}
		enctype="multipart/form-data"
		action="?/uploadfile"
		method="POST"
	>
		<div class="grid gap-1 text-base-content/70 transition-all duration-500">
			<label
				id="comment-file-input-droparea"
				class="grid min-h-14 cursor-pointer content-center justify-items-center gap-2 rounded-lg py-8 outline-dashed outline-2 outline-base-content/30 {formFileUploadLabelColor
					? 'bg-primary/10'
					: undefined}"
				ondragenter={(evt) => {
					stopDefaultEvents(evt);
					formFileUploadLabelColor = !formFileUploadLabelColor;
				}}
				ondragover={(evt) => {
					stopDefaultEvents(evt);
				}}
				ondragleave={(evt) => {
					stopDefaultEvents(evt);
					formFileUploadLabelColor = !formFileUploadLabelColor;
				}}
				ondrop={(evt) => {
					evt.preventDefault();
					evt.stopPropagation();
					const dataTransfer = new DataTransfer();
					if (evt.dataTransfer?.files[0]) {
						dataTransfer.items.add(evt.dataTransfer.files[0]);
						formFileUploadInput.files = dataTransfer.files;
					}
					if (!formFileUploadInput.files) {
						return;
					}
					if (formFileUpload.files?.length === 0) {
						return;
					}
					if (formFileUploadInput.files[0].name) {
						formFileUploadFilename = formFileUploadInput.files[0].name;
					}
					formUploadButtonSpinner = true;
					formFileUpload.requestSubmit();
				}}
				onchange={(evt) => {
					evt.preventDefault();
					evt.stopPropagation();
					if (!formFileUploadInput.files) {
						return;
					}
					if (formFileUpload.files?.length === 0) {
						return;
					}
					if (formFileUploadInput.files[0].name) {
						formFileUploadFilename = formFileUploadInput.files[0].name;
					}
					formUploadButtonSpinner = true;
					formFileUpload.requestSubmit();
				}}
			>
				<input
					type="file"
					name="fileupload"
					id="fileupload"
					bind:this={formFileUploadInput}
					accept=".csv"
					class="file-input file-input-bordered file-input-primary hidden w-full"
				/>
				<input type="hidden" name="session-id" value={session.id} />
				{#if formUploadButtonSpinner}
					<span class="loading loading-spinner loading-lg text-primary"></span>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="4em"
						height="4em"
						class="tabler:file-upload text-base-content/80"
						viewBox="0 0 24 24"
						><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path
								d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2m-5-10v6"
							/><path d="M9.5 13.5L12 11l2.5 2.5" /></g
						></svg
					>
				{/if}
				<div class="break-all px-2 text-base font-medium">
					{#if formFileUploadFilename === ''}
						<b>Select</b> or <b>Drag a file</b> to upload
					{:else}
						<b>{formFileUploadFilename}</b>
					{/if}
				</div>
			</label>
			<div class="grid grid-cols-2">
				<div class="text-sm">Allowed: .csv</div>
				<div class="justify-self-end text-sm">
					<div class="tooltip tooltip-top" data-tip="CSV file must only have 4 columns: Name, Dept, Grade, Remarks.">
						<button>Schema?</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
