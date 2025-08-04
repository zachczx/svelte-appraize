<script lang="ts">
	import { browser } from '$app/environment';
	import { useClerkContext, SignIn } from 'svelte-clerk';

	// Do not destructure context or you'll lose reactivity!
	const ctx = useClerkContext();
	const userId = $derived(ctx.auth.userId);
	let timer: number = $state(3);

	const interval = setInterval(() => {
		timer -= 1;
	}, 900);

	$effect(() => {
		if (userId) {
			if (browser) {
				setTimeout(() => {
					window.location.href = '/';
					clearInterval(interval);
				}, 3000);
			}
		}
	});
</script>

<div class="grid content-center justify-items-center">
	{#if userId === undefined}
		<span class="loading loading-spinner loading-lg text-primary"></span>
	{:else if userId === null}
		<SignIn signUpUrl="/signup" withSignUp={true}></SignIn>
	{:else if userId}
		<span class="loading loading-spinner loading-lg text-primary"></span>
		<div class="pt-4 text-lg">
			You're already logged in, <a href="/">redirecting you</a> in... <b>{timer}</b>
		</div>
	{/if}
</div>
