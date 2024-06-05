<script>
	import '../app.css';
	import { beforeNavigate, onNavigate, afterNavigate } from '$app/navigation';

	let isLoading = $state(false);
	beforeNavigate(() => {
		isLoading = true;
	});
	afterNavigate(() => {
		isLoading = false;
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{#if isLoading}
	<div class="z-30 flex min-h-dvh w-full justify-center">
		<span class="loading loading-spinner loading-lg text-primary"></span>
	</div>
{:else}
	<slot />
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(root) {
		animation:
			90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation:
			310ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
