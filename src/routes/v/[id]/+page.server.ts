import { db } from '$lib/drizzle/db';
import { records } from '$lib/drizzle/schema';
import { desc, asc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const sessionId = String(params.id);
	const result = await db
		.select()
		.from(records)
		.where(eq(records.session, sessionId))
		.orderBy(asc(records.id));
	return { result, id: sessionId };
}) satisfies PageServerLoad;

export const actions = {
	insert: async function ({ request, params }) {
		const sessionId = String(params.id);
		const submittedData = await request.formData();
		const name = String(submittedData.get('name'));
		const dept = String(submittedData.get('dept'));
		const grade = String(submittedData.get('grade'));
		await db.insert(records).values({ name: name, dept: dept, grade: grade, session: sessionId });
		return { success: true };
	},

	delete: async function ({ request }) {
		const deleteData = await request.formData();
		const target = deleteData.get('delete-target');
		await db.delete(records).where(eq(records.id, target));
	},
};
