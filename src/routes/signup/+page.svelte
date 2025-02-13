<script>
	import { useClerkContext, SignUp } from 'svelte-clerk';

	// Do not destructure context or you'll lose reactivity!
	const ctx = useClerkContext();
	const userId = $derived(ctx.auth.userId);

	// const fetchDataFromExternalResource = async () => {
	// 	const token = await ctx.session.getToken();
	// 	const response = await fetch('https://api.example.com/data', {
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	});
	// 	return response.json();
	// };
</script>

<div class="grid content-center justify-items-center">
	{#if userId === undefined}
		<p>Loading...</p>
	{:else if userId === null}
		<SignUp></SignUp>
	{:else}
		<div>...</div>
	{/if}
</div>
