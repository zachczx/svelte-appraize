import { fail } from '@sveltejs/kit';
import { db } from '$lib/drizzle/db';
import { records, sessions, users } from '$lib/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async ({ request }) => {
	redirect(307, '/');
};

/**
 * Converted previous autoSave form action as a separate route here.
 * Otherwise, combination of use:enhance, $effect (for setInterval), requestSubmit, load function wrecked havoc.
 * submit was ok, but caused full page reloads.
 * Number of load function execution/trigger and form submissions increased exponentially as time went on, not sure why though.
 * Anyway a separate endpoint is good, doesn't trigger load function at all.
 */
export const actions = {
	default: async function ({ request }) {
		try {
			const formData = await request.formData();
			const sessionId: string = String(formData.get('session-id'));

			// Grab the sortable order
			const orderInput: string = String(formData.get('order'));
			if (!orderInput) {
				return fail(400, { formSaveFail: true });
			}
			const orderArray = orderInput.split(',');
			for (let i = 0; i < orderArray.length; i++) {
				let individualOrder = i + 1;
				await db
					.update(records)
					.set({ sequence: individualOrder })
					.where(and(eq(records.session, sessionId), eq(records.id, orderArray[i])));
			}
			console.log('Autosaved');
			return { formSaveSuccess: true };
		} catch (error) {
			console.log(error);
			return fail(400, { formSaveFail: true });
		}
	},
};
