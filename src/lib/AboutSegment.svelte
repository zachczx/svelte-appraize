<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PageProps } from '../routes/$types';

	interface AboutProps {
		question: string;
		children: Snippet;
	}
	let { question = '', children }: AboutProps = $props();
</script>

<div
	class="collapse join-item collapse-arrow rounded-none border-b border-t-0 border-b-base-content/20 border-t-base-content/20 py-2 first-of-type:border-t"
>
	<input type="radio" name="faqs-accordion" />
	<div class="collapse-title mb-0 px-0 text-lg font-bold text-base-content/60">
		{question}
	</div>
	<div class="collapse-content space-y-4 px-0">
		{@render children()}
	</div>
</div>
