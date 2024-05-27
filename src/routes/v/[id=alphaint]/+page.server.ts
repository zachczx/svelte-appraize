import { db } from '$lib/drizzle/db';
import { records } from '$lib/drizzle/schema';
import { desc, asc, eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

let delay = (time) => {
	return new Promise((res) => {
		setTimeout(res, time);
	});
};

export const load = (async ({ params }) => {
	const sessionId = String(params.id);
	const result = await db
		.select()
		.from(records)
		.where(eq(records.session, sessionId))
		.orderBy(asc(records.sequence));
	//await delay(5000);
	return {
		id: sessionId,
		streamed: {
			result: result,
		},
	};
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

	save: async function ({ request, params }) {
		try {
			const sessionId = String(params.id);
			const saveData = await request.formData();
			const orderInput = saveData.get('order');
			const orderArray = orderInput.split(',');
			/*
		for (let [index, element] of orderArray.entries()) {
			console.log(index, element);
		} */
			for (let i = 0; i < orderArray.length; i++) {
				let individualOrder = i + 1;
				console.log(individualOrder, orderArray[i]);
				await db
					.update(records)
					.set({ sequence: individualOrder })
					.where(and(eq(records.session, sessionId), eq(records.uuid, orderArray[i])));
			}
			return { success: true };
		} catch (error) {
			console.log("There's an error:");
			console.log(error);
		}
	},
};
