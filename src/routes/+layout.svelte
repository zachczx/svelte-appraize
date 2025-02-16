<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import type { Snippet } from '@svelte';
	import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from 'svelte-clerk';

	const { children }: { children: Snippet } = $props();

	// onNavigate((navigation) => {
	// 	if (!document.startViewTransition) return;
	// 	return new Promise((resolve) => {
	// 		document.startViewTransition(async () => {
	// 			resolve();
	// 			await navigation.complete;
	// 		});
	// 	});
	// });
</script>

<svelte:head>
	<title>Appraize</title>
</svelte:head>

<ClerkProvider>
	<div class="relative grid min-h-dvh grid-cols-[auto_1fr] bg-base-200">
		<nav
			class="sticky top-0 z-[1] grid h-dvh w-16 grid-rows-[1fr_auto] border-2 border-black/10 bg-base-300 py-4 text-base-content/70"
		>
			<div class="grid content-start justify-items-center gap-2">
				<h1 class="mb-4 p-1 text-5xl font-black text-primary">
					<a href="/">A</a>
				</h1>
				<a
					href="/"
					aria-label="Home"
					class="dropdown dropdown-right dropdown-hover flex items-center justify-center rounded-xl p-3 text-3xl hover:bg-primary hover:text-primary-content"
				>
					<div tabindex="-1" role="button" class="">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon icon-tabler icons-tabler-outline icon-tabler-home"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M5 12l-2 0l9 -9l9 9l-2 0" />
							<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
							<path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
						</svg>
					</div>
					<ul
						tabindex="-1"
						class="menu dropdown-content z-[1] ms-1 mt-1 rounded-box bg-neutral p-2 px-4 text-neutral-content shadow"
					>
						<li>Home</li>
					</ul>
				</a>

				<a
					href="/dashboard"
					aria-label="Dashboard"
					class="dropdown dropdown-right dropdown-hover flex items-center justify-center rounded-xl p-3 text-3xl hover:bg-primary hover:text-primary-content"
				>
					<div tabindex="-1" role="button" class="">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							class="tabler:layout-dashboard"
							viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1m0 12h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1m10-4h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1m0-8h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1"
							/>
						</svg>
					</div>
					<ul
						tabindex="-1"
						class="menu dropdown-content z-[1] ms-1 mt-1 rounded-box bg-neutral p-2 px-4 text-neutral-content shadow"
					>
						<li>Dashboard</li>
					</ul>
				</a>

				<a
					href="/help"
					aria-label="Help"
					class="dropdown dropdown-right dropdown-hover flex items-center justify-center rounded-xl p-3 text-3xl hover:bg-primary hover:text-primary-content"
				>
					<div tabindex="-1" role="button" class=""></div>
					<ul
						tabindex="-1"
						class="menu dropdown-content z-[1] ms-1 mt-1 rounded-box bg-neutral p-2 px-4 text-neutral-content shadow"
					>
						<li>Help</li>
					</ul>
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="tabler:help" viewBox="0 0 24 24"
						><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9 5v.01" /><path
								d="M12 13.5a1.5 1.5 0 0 1 1-1.5a2.6 2.6 0 1 0-3-4"
							/></g
						></svg
					>
				</a>
				<a
					href="https://zixianchen.com/contact"
					aria-label="Contact"
					class="dropdown dropdown-right dropdown-hover flex items-center justify-center rounded-xl p-3 text-3xl hover:bg-primary hover:text-primary-content"
				>
					<div tabindex="-1" role="button" class="">
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="tabler:mail" viewBox="0 0 24 24"
							><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path
									d="m3 7l9 6l9-6"
								/></g
							></svg
						>
					</div>
					<ul
						tabindex="-1"
						class="menu dropdown-content z-[1] ms-1 mt-1 rounded-box bg-neutral p-2 px-4 text-neutral-content shadow"
					>
						<li>Contact</li>
					</ul>
				</a>
			</div>
			<div class="grid content-start justify-items-center">
				<SignedIn
					><div class="dropdown dropdown-right dropdown-hover">
						<div tabindex="-1" role="button" class="">
							<UserButton userProfileMode="modal" />
						</div>
						<ul
							tabindex="-1"
							class="menu dropdown-content z-[1] ms-1 mt-1 rounded-box bg-neutral p-2 px-4 text-neutral-content shadow"
						>
							<li>Account</li>
						</ul>
					</div>
				</SignedIn>
				<SignedOut>
					<a
						href="/login"
						class="dropdown dropdown-right dropdown-hover flex items-center justify-center rounded-xl p-3 text-3xl hover:bg-primary hover:text-primary-content"
						aria-label="login"
					>
						<div tabindex="-1" role="button" class="">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								class="tabler:login-2"
								viewBox="0 0 24 24"
								><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									><path d="M9 8V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2" /><path
										d="M3 12h13l-3-3m0 6l3-3"
									/></g
								></svg
							>
						</div>
						<ul
							tabindex="-1"
							class="menu dropdown-content z-[1] ms-1 mt-1 rounded-box bg-neutral p-2 px-4 text-neutral-content shadow"
						>
							<li>Login</li>
						</ul>
					</a>
				</SignedOut>
			</div>
		</nav>
		{@render children()}
	</div>
</ClerkProvider>

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
