/** @type {import('./$types').Actions} */

import { redirect } from '@sveltejs/kit';

//superforms imports
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';

// Superforms
const schema = z.object({
	session: z
		.string()
		.min(1, { message: "You didn't type anything!" })
		.regex(/^[a-zA-Z0-9]*$/, { message: 'No special characters, symbols, spaces!' }),
	//original regex for special chars = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/
});

export const load = async () => {
	const form = await superValidate(zod(schema));

	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const nextPage = '/v/' + form.data.session;
		redirect(301, nextPage);
	},
};
