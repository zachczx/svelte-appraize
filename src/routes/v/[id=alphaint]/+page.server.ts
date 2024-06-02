import { db } from '$lib/drizzle/db';
import { records } from '$lib/drizzle/schema';
import { desc, asc, eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

//superforms
import { z } from 'zod';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

let delay = (time) => {
	return new Promise((res) => {
		setTimeout(res, time);
	});
};

/* export const load = (async ({ params }) => {
	const sessionId = String(params.id);
	//await delay(5000);
	const result = await db
		.select()
		.from(records)
		.where(eq(records.session, sessionId))
		.orderBy(asc(records.sequence));

	return {
		id: sessionId,
		streamed: {
			result: result,
		},
	};
}) satisfies PageServerLoad; */

export const load = (({ params }) => {
	const sessionId = String(params.id);
	const result = db
		.select()
		.from(records)
		.where(eq(records.session, sessionId))
		.orderBy(asc(records.sequence));

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
		let currentLargestSequence = await db
			.select()
			.from(records)
			.where(eq(records.session, sessionId))
			.orderBy(desc(records.sequence))
			.limit(1);
		let sequenceToInsert;
		console.log(typeof currentLargestSequence);
		if (currentLargestSequence == 0) {
			sequenceToInsert = 1;
			console.log('if', sequenceToInsert);
		} else {
			sequenceToInsert = currentLargestSequence[0].sequence + 1;
			console.log('else', sequenceToInsert);
		}

		const submittedData = await request.formData();
		const name = String(submittedData.get('name'));
		const dept = String(submittedData.get('dept'));
		const grade = String(submittedData.get('grade'));
		const remarks = String(submittedData.get('remarks'));
		console.log(name, dept, grade, remarks);
		await db.insert(records).values({
			name: name,
			dept: dept,
			grade: grade,
			session: sessionId,
			sequence: sequenceToInsert,
			remarks: remarks,
		});
		return { formInsertSuccess: true };
	},

	edit: async ({ request }) => {
		const editData = await request.formData();
		console.log(editData);
		const editTarget = editData.get('edit-target');
		const editName = String(editData.get('edit-name'));
		const editDept = String(editData.get('edit-dept'));
		const editGrade = String(editData.get('edit-grade'));
		if (editGrade === 'A' || editGrade === 'B' || editGrade === 'C' || editGrade === 'D') {
			console.log(editName, editDept, editGrade);
			await db
				.update(records)
				.set({ name: editName, dept: editDept, grade: editGrade })
				.where(eq(records.id, editTarget));
			return { editInsertSuccess: true };
		} else {
			return { editInsertFailedGrade: true };
		}
	},

	editgrade: async ({ request }) => {
		const editGradeData = await request.formData();
		console.log(editGradeData);
		const editGradeGrade = String(editGradeData.get('grade'));
		const editGradeName = String(editGradeData.get('edit-grade-target-name'));
		const editGradeId = editGradeData.get('edit-grade-target');
		console.log(editGradeName, editGradeGrade, editGradeId);
		if (
			editGradeGrade === 'A' ||
			editGradeGrade === 'B' ||
			editGradeGrade === 'C' ||
			editGradeGrade === 'D'
		) {
			await db.update(records).set({ grade: editGradeGrade }).where(eq(records.id, editGradeId));
			console.log('Edit grade success!');
			return { editEditGradeSuccess: true };
		} else {
			console.log('Edit grade failed');
			return { editEditGradeSuccess: false };
		}
	},

	delete: async function ({ request }) {
		const deleteData = await request.formData();
		const delTarget = deleteData.get('delete-target');
		await delay(700);
		await db.delete(records).where(eq(records.id, delTarget));
	},

	save: async function ({ request, params }) {
		try {
			const sessionId = String(params.id);
			const saveData = await request.formData();
			const orderInput = saveData.get('order');

			const orderArray = orderInput.split(',');

			for (let i = 0; i < orderArray.length; i++) {
				let individualOrder = i + 1;
				//console.log(individualOrder, orderArray[i]);
				await db
					.update(records)
					.set({ sequence: individualOrder })
					.where(and(eq(records.session, sessionId), eq(records.uuid, orderArray[i])));
			}
			await delay(500);
			return { formSaveSuccess: true };
		} catch (error) {
			console.log("There's an error:");
			console.log(error);
			return fail(400, { formSaveFail: true });
		}
	},

	deleteSession: async function ({ request, params }) {
		const sessionId = params.id;
		await delay(400);
		const deleteSession = await db.delete(records).where(eq(records.session, sessionId));
		if (deleteSession) {
			console.log('Deleted successfully!');
			redirect(307, '/');
		} else {
			return fail(400, { formDeleteSessionFail: true });
		}
	},
};
