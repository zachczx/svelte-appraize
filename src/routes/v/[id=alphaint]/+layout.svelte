<script>
	import { enhance } from '$app/forms';
</script>

<slot />

<style>
	.view-header {
		view-transition-name: view-header;
	}
	.view-top-navbar-input {
		view-transition-name: view-top-navbar-input;
	}

	.view-outline {
		view-transition-name: view-outline;
	}
	.view-footer {
		view-transition-name: view-footer;
	}
</style>
