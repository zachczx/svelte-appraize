/** @type {import('./$types').Actions} */

import { redirect } from '@sveltejs/kit';
import { db } from '$lib/drizzle/db';
import { records, sessions, users } from '$lib/drizzle/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { slugify } from '$lib/utils';
import { clerkClient } from 'svelte-clerk/server';

// Superforms
const schema = z.object({
	session: z
		.string()
		.min(1, { message: "You didn't type anything!" })
		.regex(/^[a-zA-Z0-9-]*$/, { message: 'No special characters, symbols, spaces!' }),
	//* instead of + to allow matching of blank entry
	//original regex for special chars = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/
});

export const load = async () => {
	const form = await superValidate(zod(schema));
	return { form };
};

const defaultUser: string = 'guest@guest.com';
export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}
		/////////////////////////

		const { userId } = locals.auth();
		let ownerIdToInsert: string;
		if (!userId) {
			let resultDefaultUser = await db.select().from(users).where(eq(users.email, defaultUser));
			if (resultDefaultUser.length === 0) {
				console.log('not found, inserted default user');
				resultDefaultUser = await db.insert(users).values({ id: defaultUser, email: defaultUser }).returning();
			}
			ownerIdToInsert = resultDefaultUser[0].id;
		} else {
			const user = await clerkClient.users.getUser(userId);
			const clerkUserEmail = user.emailAddresses[0].emailAddress;
			let resultUser = await db.select().from(users).where(eq(users.email, clerkUserEmail));
			if (resultUser.length === 0) {
				console.log('clerk authenticated user not found in my db, inserting clerk user');
				resultUser = await db.insert(users).values({ id: userId, email: clerkUserEmail }).returning();
			}
			ownerIdToInsert = resultUser[0].id;
		}

		const slugTitle = slugify(form.data.session);
		let session = await db.select().from(sessions).where(eq(sessions.title, form.data.session));
		let res;
		if (session.length === 0) {
			console.log('session not found!');
			res = await db
				.insert(sessions)
				.values({ title: form.data.session, slug: slugTitle, owner: ownerIdToInsert })
				.returning();
			console.log('inserted session');
			if (!res) {
				return fail(500, { message: 'Error with session!' });
			}
		}

		const nextPage = '/session/' + form.data.session;
		redirect(301, nextPage);
	},
};
