/** @type {import('./$types').Actions} */

import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const inputData = await request.formData();
		const nextPage = '/v/' + inputData.get('name');
		redirect(301, nextPage);
	},
};
