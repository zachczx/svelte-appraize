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

/**
 * I can use array.shift() to remove the first element of array, so that we can work backwards.
 * Alternatively, I can use a uuid to identify each entry, and use a for loop to remove that element.
 * But that's a lot of overhead for something not important.
 */
export function addToast(status: 'success' | 'error', message: string) {
	showMessages.push({ status: status, message: message });

	setTimeout(() => {
		showMessages.shift();
	}, 3000);
}

export function getToast() {
	return showMessages;
}

const random = () => {
	return Math.floor(Math.random() * messages.length);
};
