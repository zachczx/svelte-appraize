<script>
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
</script>

<div class="flex justify-center p-10">
	<div
		class="view-outline grid w-full max-w-5xl space-y-10 rounded-2xl border border-primary p-10 shadow-md"
	>
		<div>
			<h1 class="view-header text-primary"><a href="/">Appraize</a></h1>
		</div>

		<div>
			<slot />
		</div>
	</div>
</div>

<style>
	.view-header {
		view-transition-name: view-header;
	}
	.view-outline {
		view-transition-name: view-outline;
	}
</style>
