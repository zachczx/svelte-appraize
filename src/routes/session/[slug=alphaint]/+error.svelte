<script>
	import { page } from '$app/state';
	import ErrorSpaceship from '$lib/svg/error-alien-spaceship.svg?dataurl';
	import ErrorAquarium from '$lib/svg/error-aquarium.svg?dataurl';
</script>

<div class="grid min-h-dvh content-center justify-items-center gap-8">
	{#if page.error?.message}
		<img src={ErrorAquarium} alt="Error" class="h-72" />
		<div class="grid gap-2 text-center">
			{#if page.status === 401}
				<h1>Authentication error</h1>
				<p>{page.error.message}</p>
			{:else if page.status === 403}
				<h1>Permission error</h1>
				<p>{page.error.message}</p>
			{:else if page.status === 500}
				<h1>Server error</h1>
				<p>{page.error.message}</p>
			{/if}
		</div>
	{:else}
		<img src={ErrorSpaceship} alt="Error" class="h-72" />
		<div class="grid gap-2 text-center">
			<h1>Oops, an error!</h1>
			<p>This page wasn't found. Try something else.</p>
		</div>
	{/if}
</div>
