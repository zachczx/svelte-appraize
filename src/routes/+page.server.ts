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

const defaultUser: string = 'test@test.com';
export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		let resultDefaultUser = await db.select().from(users).where(eq(users.email, defaultUser));
		if (resultDefaultUser.length === 0) {
			console.log('not found, inserted default user');
			resultDefaultUser = await db.insert(users).values({ email: defaultUser }).returning();
		}

		const slugTitle = slugify(form.data.session);

		let session = await db.select().from(sessions).where(eq(sessions.title, form.data.session));
		let res;
		console.log(form.data.session);
		console.log(resultDefaultUser[0]);
		if (session.length === 0) {
			console.log('session not found!');
			res = await db
				.insert(sessions)
				.values({ title: form.data.session, slug: slugTitle, owner: resultDefaultUser[0].id })
				.returning();
			console.log('inserted session');
		}

		const nextPage = '/v/' + form.data.session;
		redirect(301, nextPage);
	},
};
