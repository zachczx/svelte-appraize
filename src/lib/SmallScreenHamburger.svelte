<script>
	let { propFormSaveSession, propOrder } = $props();
	import { enhance } from '$app/forms';
</script>

<form method="POST" action="?/save" id="hamburgerForm" bind:this={propFormSaveSession} use:enhance>
	<input type="hidden" name="order" value={propOrder} />
</form>
<div class="dropdown">
	<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
			><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg
		>
	</div>
	<ul tabindex="-1" class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
		<li>
			<a href="/" class="text-xl font-bold"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-home mb-1 me-2 inline"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M5 12l-2 0l9 -9l9 9l-2 0" />
					<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
					<path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
				</svg>Home</a
			>
		</li>
		<li>
			<button type="submit" form="hamburgerForm" class="text-xl font-bold"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy mb-1 me-2 inline"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
					<path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
					<path d="M14 4l0 4l-6 0l0 -4" />
				</svg>Save</button
			>
		</li>
	</ul>
</div>
