import { redirect } from '@sveltejs/kit';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ locals }) => {
	const { userId } = locals.auth;

	if (!userId) {
		return redirect(307, '/login');
	}
	const user = await clerkClient.users.getUser(userId);
	const email = user.emailAddresses[0].emailAddress;

	return { user: JSON.parse(JSON.stringify(user)), email };
};
