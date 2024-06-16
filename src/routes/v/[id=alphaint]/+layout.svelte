<script>
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
</script>

<slot />
<div class="grid grid-cols-4">
	<div
		class="col-span-1 hidden border-b-2 border-r-2 border-gray-200 bg-gray-50 py-4 pe-4 ps-5 text-2xl lg:block"
	></div>
	<div class="view-footer col-span-4 flex w-full items-center justify-center pb-4 pt-8 lg:col-span-3 lg:pt-12">
		Copyright © 2024 Zixian Chen. All rights reserved.
	</div>
</div>

<style>
	.view-outline {
		view-transition-name: view-outline;
	}
	.view-footer {
		view-transition-name: view-footer;
	}
</style>
