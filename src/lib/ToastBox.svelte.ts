import { fade, fly, slide } from 'svelte/transition';

interface Messages {
	status: 'success' | 'error';
	message: string;
}

interface ShowMessages {
	status: 'success' | 'error';
	message: string;
}

let messages: Messages[] = [
	{ status: 'success', message: 'Hello! This is a toast message' },
	{ status: 'success', message: 'Successful authentication!' },
	{ status: 'error', message: "You're not authenticated!" },
	{ status: 'error', message: "You don't have permission to do this!" },
];

let showMessages: ShowMessages[] = $state([]);

export function addToast(status: 'success' | 'error', message: string) {
	showMessages.push({ status: status, message: message });

	setTimeout(() => {
		showMessages.shift();
	}, 3000);
}

export function getToast() {
	return showMessages;
}

/**
 * I can use array.shift() to remove the first element of array, so that we can work backwards.
 * Alternatively, I can use a uuid to identify each entry, and use a for loop to remove that element.
 * But that's a lot of overhead for something not important.
 */

export function showToast(status: 'success' | 'error', message: string) {
	const x = random();
	// let chosenMessage: ShowMessages = messages[x];
	let chosenMessage: ShowMessages = { status: status, message: message };

	showMessages.push(chosenMessage);

	setTimeout(() => {
		showMessages.shift();
	}, 3000);
}

const random = () => {
	return Math.floor(Math.random() * messages.length);
};

/* <div class="relative grid content-center justify-items-center">
	<ul class="fixed left-1/2 top-1 grid w-full max-w-96 -translate-x-1/2 gap-2">
		{#each showMessages as message, i}
			<li
				class="flex items-center gap-4 rounded-xl {message.status === 'success'
					? 'bg-success text-success-content'
					: 'bg-error text-error-content'} px-4 py-2"
				in:slide={{ duration: 500, axis: 'y' }}
				out:slide={{ duration: 70, axis: 'y' }}
			>
				<div>
					{#if message.status === 'success'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="2em"
							height="2em"
							class="tabler:circle-check-filled"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34m-1.293 5.953a1 1 0 0 0-1.32-.083l-.094.083L11 12.585l-1.293-1.292l-.094-.083a1 1 0 0 0-1.403 1.403l.083.094l2 2l.094.083a1 1 0 0 0 1.226 0l.094-.083l4-4l.083-.094a1 1 0 0 0-.083-1.32"
							/></svg
						>{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="2em"
							height="2em"
							class="tabler:exclamation-circle-filled"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M17 3.34A10 10 0 1 1 2 12l.005-.324A10 10 0 0 1 17 3.34M12 15a1 1 0 0 0-1 1v.01a1 1 0 0 0 2 0V16a1 1 0 0 0-1-1m0-7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1"
							/></svg
						>{/if}
				</div>
				<div class="grow">{message.message}</div>
			</li>
		{/each}
	</ul>
</div> */
