<script>
	import { useClerkContext, SignIn } from 'svelte-clerk';

	// Do not destructure context or you'll lose reactivity!
	const ctx = useClerkContext();
	const userId = $derived(ctx.auth.userId);
</script>

<div class="grid content-center justify-items-center">
	{#if userId === undefined}
		<p>Loading...</p>
	{:else if userId === null}
		<SignIn signUpUrl="/signup" withSignUp={true}></SignIn>
	{:else}
		<div>...</div>
	{/if}
</div>
