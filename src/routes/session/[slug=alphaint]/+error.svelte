<script>
	import { page } from '$app/stores';
	import ErrorSpaceship from '$lib/svg/error-alien-spaceship.svg?dataurl';
</script>

<div class="grid min-h-dvh content-center justify-items-center gap-8">
	<img src={ErrorSpaceship} alt="Error" class="h-72" />
	<!-- <h1>{$page.status}: {$page.error.message}</h1> -->
	<div class="grid gap-2 text-center">
		<h1>Oops, an error!</h1>
		<p>This page wasn't found. Try something else.</p>
	</div>
</div>
