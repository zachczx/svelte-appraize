<script>
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
</script>

<div class="flex justify-center p-2 md:p-10">
	<div class="view-outline grid max-w-5xl space-y-5 rounded-2xl border-2 border-primary shadow-lg">
		<div>
			<h1 class="view-header p-2 text-primary md:px-10 md:pt-10"><a href="/">Appraize</a></h1>
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
