<script lang="ts">
	import { useClerkContext } from 'svelte-clerk';
	const ctx = useClerkContext();
	const userId = $derived(ctx.auth.userId);
	const user = $derived(ctx.user);
	console.log(userId);

	let { data } = $props();
</script>

{data.email}
