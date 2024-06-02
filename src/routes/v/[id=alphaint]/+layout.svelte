<script>
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
</script>

<section class="flex bg-primary px-10 py-5">
	<!-- Header -->
	<h1 class="view-header grow text-base-100"><a href="/">Appraize</a></h1>

	<div class="content-end self-center text-xl font-bold text-base-100">
		<a href="https://zixianchen.com/">About</a>
	</div>
</section>
<slot />

<!-- <div class="flex justify-center p-2 md:p-10">
	<div class="view-outline grid max-w-5xl space-y-5 rounded-2xl border-2 border-primary shadow-lg">
		<div>
			<h1 class="p-2 text-primary md:px-10 md:pt-10"><a href="/">Appraize</a></h1>
		</div>

		<div>
			<slot />
		</div>
	</div>
</div> -->

<style>
	.view-header {
		view-transition-name: view-header;
	}
	.view-outline {
		view-transition-name: view-outline;
	}
</style>
