import { db } from '$lib/drizzle/db';
import { records, sessions, users } from '$lib/drizzle/schema';
import type { Action } from './$types';
import { desc, asc, eq, and, or, ilike } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { slugify } from '$lib/utils';
//superforms
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
// R2 Bucket imports
import { PUBLIC_S3_BUCKET_NAME } from '$env/static/public'; //it's a public key, so prefix PUBLIC_ requires fetching from public, not private
import { R2_S3 } from '$lib/R2_S3';
import { Upload } from '@aws-sdk/lib-storage';
//For Buffer/Handling of file
import Papa from 'papaparse';
import { error } from '@sveltejs/kit';
import { clerkClient } from 'svelte-clerk/server';

const regexRoute = /^[a-zA-Z0-9-]*$/;
const uploadSizeLimit = 10000;
const grades = ['A', 'B', 'C+', 'C', 'C-', 'D'];

/**
 *
 * @param time integer in milliseconds
 * @returns
 */
let delay = (time: number) => {
	return new Promise((res) => {
		setTimeout(res, time);
	});
};

export const load = (async ({ params, locals }) => {
	console.log('Load triggered');
	const paramSessionSlug = String(params.slug);
	const sessionArray = await db
		.select({
			id: sessions.id,
			title: sessions.title,
			slug: sessions.slug,
			timestamp: sessions.timestamp,
			owner: sessions.owner,
			locked: sessions.locked,
			username: users.name,
			email: users.email,
		})
		.from(sessions)
		.leftJoin(users, eq(sessions.owner, users.id))
		.where(eq(sessions.slug, paramSessionSlug));

	const session = sessionArray[0];
	if (!session) {
		error(404, { message: 'Not found' });
	}

	if (session.locked) {
		const { userId } = locals.auth;

		if (!userId) {
			return error(401, { message: 'You are not authenticated!' });
		}
		const hasPermission = checkUserIsSessionOwner(db, userId);
		if (!hasPermission) {
			return fail(403, { message: 'You do not have permission to access this!' });
		}
	}
	let result = await db.select().from(records).where(eq(records.session, session.id)).orderBy(asc(records.sequence));
	let sequence = getInitSequence(result);

	return {
		session,
		result,
		sequence,
	};
}) satisfies PageServerLoad;

export const actions = {
	insert: async function ({ request, locals }) {
		const submittedData = await request.formData();
		if (!submittedData.get('name')) {
			return fail(400, { insertNameMissing: true });
		}
		if (!submittedData.get('dept')) {
			return fail(400, { insertDeptMissing: true });
		}
		if (!submittedData.get('grade')) {
			return fail(400, { insertGradeMissing: true });
		}
		if (!submittedData.get('session-id')) {
			return fail(400, { insertSessionIdMissing: true });
		}
		const name = String(submittedData.get('name'));
		const dept = String(submittedData.get('dept'));
		const grade = String(submittedData.get('grade'));
		const rawRemarks = submittedData.get('remarks');
		let remarks;
		if (rawRemarks !== null) {
			remarks = String(rawRemarks);
		}
		const sessionId = String(submittedData.get('session-id'));

		// Set owner
		const { userId } = locals.auth;
		if (!userId) {
			redirect(307, '/login');
		}
		let resultUser = await db.select().from(users).where(eq(users.id, userId));
		if (resultUser.length === 0) {
			console.log('clerk authenticated user not found in my db, inserting clerk user to fix that');
			const user = await clerkClient.users.getUser(userId);
			const clerkUserEmail = user.emailAddresses[0].emailAddress;
			resultUser = await db.insert(users).values({ id: userId, email: clerkUserEmail }).returning();
		}

		let currentLargestSequence = await db
			.select({
				sequence: records.sequence,
			})
			.from(records)
			.where(eq(records.session, sessionId))
			.orderBy(desc(records.sequence))
			.limit(1);
		let sequenceToInsert = 1;
		if (currentLargestSequence.length > 0) {
			if (currentLargestSequence[0].sequence) {
				sequenceToInsert = currentLargestSequence[0].sequence + 1;
			}
		}

		const res = await db.insert(records).values({
			name: name,
			dept: dept,
			grade: grade,
			session: sessionId,
			sequence: sequenceToInsert,
			remarks: remarks,
			owner: userId,
		});
	},

	edit: async ({ request }) => {
		const formData = await request.formData();
		const name = String(formData.get('edit-name'));
		const dept = String(formData.get('edit-dept'));
		const remarks = String(formData.get('edit-remarks'));
		const sessionId = String(formData.get('edit-session-id'));
		const recordId = String(formData.get('edit-record-id'));
		console.log(name);
		const res = await db
			.update(records)
			.set({ name: name, dept: dept, remarks: remarks })
			.where(eq(records.id, recordId));
		return { editInsertSuccess: true };
	},

	editgrade: async ({ request }) => {
		const editGradeData = await request.formData();
		const editGradeGrade = String(editGradeData.get('grade'));
		const editGradeName = String(editGradeData.get('edit-grade-target-name'));
		const editGradeId = String(editGradeData.get('edit-grade-target'));
		console.log(editGradeName, editGradeGrade, editGradeId);
		if (
			editGradeGrade === 'A' ||
			editGradeGrade === 'B' ||
			editGradeGrade === 'C+' ||
			editGradeGrade === 'C' ||
			editGradeGrade === 'C-' ||
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
		const formData = await request.formData();
		const delTarget: string = String(formData.get('delete-target'));
		await db.delete(records).where(eq(records.id, delTarget));
	},

	save: async function ({ request, params }) {
		try {
			const formData = await request.formData();
			const sessionId: string = String(formData.get('session-id'));

			// Grab the sortable order
			const orderInput: string = String(formData.get('order'));
			if (!orderInput) {
				return fail(400, { formSaveFail: true });
			}

			const orderArray = orderInput.split(',');
			console.log('Form submitted formdata:', orderArray);

			for (let i = 0; i < orderArray.length; i++) {
				let individualOrder = i + 1;
				console.log(individualOrder, orderArray[i]);
				await db
					.update(records)
					.set({ sequence: individualOrder })
					.where(and(eq(records.session, sessionId), eq(records.id, orderArray[i])));
			}
			console.log('Order saved successfully');
			return { formSaveSuccess: true };
		} catch (error) {
			console.log(error);
			return fail(400, { formSaveFail: true });
		}
	},

	deleteSession: async function ({ request }) {
		const formData = await request.formData();
		const sessionId = String(formData.get('session-id'));
		if (!sessionId) {
			return fail(400, { formDeleteSessionFail: true });
		}

		// const deleteRecords = await db.delete(records).where(eq(records.session, sessionId));
		const deleteSession = await db.delete(sessions).where(eq(sessions.id, sessionId));
		if (deleteSession) {
			console.log('Deleted successfully!');
			redirect(307, '/');
		} else {
			return fail(400, { formDeleteSessionFail: true });
		}
	},

	filter: async function ({ request, params }) {
		const formData = await request.formData();
		const sessionTitle = formData.get('session-title');
		let filterFormInput;
		let filterFormGradeInput;
		let finalUrlString;

		if (formData.get('filter')) {
			filterFormInput = 'filter=' + String(formData.get('filter')).trim();
			console.log('Server received filter string: ', filterFormInput);
		}

		if (grades.includes(String(formData.get('grade')))) {
			filterFormGradeInput = 'grade=' + String(formData.get('grade'));
			console.log('Server received filter string: ', filterFormGradeInput);
		} else if (formData.get('grade') === 'All') {
			filterFormGradeInput = '';
		}

		if (filterFormInput && (!filterFormGradeInput || filterFormGradeInput === 'All')) {
			finalUrlString = filterFormInput;
		} else if (!filterFormInput && filterFormGradeInput) {
			finalUrlString = filterFormGradeInput;
		} else if (filterFormInput && filterFormGradeInput) {
			finalUrlString = filterFormInput + '&' + filterFormGradeInput;
		} else {
			finalUrlString = '';
		}
		redirect(307, `/session/${sessionTitle}/?${finalUrlString}`);
	},

	redirect: async ({ request }) => {
		const inputData = await request.formData();
		const inputSession = String(inputData.get('session'));
		let inputSessionTrimmed = '';
		if (inputSession) {
			inputSessionTrimmed = inputSession.trim();
		}
		if (regexRoute.test(inputSessionTrimmed)) {
			redirect(307, `/session/${inputSessionTrimmed}`);
		} else {
			return fail(400, { formRedirectFailed: true });
		}
	},

	uploadfile: async function ({ request, params }) {
		const formData = await request.formData();
		const sessionId: string = formData.get('session-id') as string;
		const file = formData.get('fileupload') as File;
		if (!file) {
			return fail(400, { uploadFailed: true });
		}
		const fileBuffer = Buffer.from(await file.arrayBuffer()); //readable after upload to r2
		const fileBuffertoString = fileBuffer.toString();
		const arrayFile = Papa.parse(fileBuffertoString);

		/**
		 * @param {Object[]} data - Data object output from Papaparse
		 * @param {string} data[][0] - Name
		 * @param {string} data[][1] - Dept
		 * @param {string} data[][2] - Grade A/B/C+/C/C-/D
		 * @param {string} data[][3] - Remarks (optional)
		 */
		const data: string[][] = arrayFile.data as string[][];
		const row = await db
			.select()
			.from(records)
			.where(eq(records.session, sessionId))
			.orderBy(desc(records.sequence))
			.limit(1);
		let dbLargestSequence = 0;
		if (row.length > 0) {
			if (row[0].sequence) {
				dbLargestSequence = row[0].sequence;
			}
		}
		dbInsertCsvRows(sessionId, data, db, dbLargestSequence);

		// Upload to Cloudflare R2
		if (!file.name || file.name === undefined) {
			return fail(400, { error: true, message: 'You must provide a file to upload' });
		} else if (
			file.type != 'text/csv' ||
			!file.type ||
			file.name.trim() === '' ||
			file.type.trim() === '' ||
			file.size > uploadSizeLimit
		) {
			console.log('Fail, not a csv file');
			return fail(400, { error: true, message: 'You must upload a .csv file' });
		}

		const objectKey = `${slugify(Date.now().toString())}-${slugify(file.name)}.csv`;

		const send = new Upload({
			client: R2_S3,
			params: {
				Bucket: PUBLIC_S3_BUCKET_NAME,
				Key: objectKey,
				Body: fileBuffer,
				ContentType: file.type,
				ACL: 'public-read',
			},
		});
		send.on('httpUploadProgress', (progress) => {
			console.log('uploaded!!!');
		});

		await send.done();
		return { uploadSuccess: true };
	},

	editSessionTitle: async function ({ request }) {
		const formData = await request.formData();
		const sessionId = String(formData.get('session-id'));
		const newTitle = String(formData.get('title'));
		const slugTitle = slugify(newTitle);
		const edit = await db.update(sessions).set({ title: newTitle, slug: slugTitle }).where(eq(sessions.id, sessionId));
		if (!edit) {
			return fail(400, { error: true, message: 'Edit failed!' });
		}
		redirect(301, `/session/${slugTitle}`);
	},

	toggleTalent: async function ({ request }) {
		const formData = await request.formData();
		const talent = formData.get('talent') === 'true' ? true : false;
		const recordId = String(formData.get('record-id'));
		const update = await db.update(records).set({ talent: talent }).where(eq(records.id, recordId));
		if (!update) {
			return fail(400, { error: true, message: 'Update failed!' });
		}
		return { updateTalentSuccess: true };
	},

	toggleLock: async function ({ request, params, locals }) {
		const session = await db
			.select({ owner: sessions.owner })
			.from(sessions)
			.where(eq(sessions.slug, String(params.slug)));
		const { userId } = locals.auth;
		if (session.length === 0) {
			return fail(400, { error: true, message: 'Session empty!' });
		}
		if (!userId) {
			return fail(400, { error: true, message: `You're not authenticated!` });
		}
		if (userId !== session[0].owner) {
			return fail(400, { error: true, message: `You don't have permission to do that!` });
		}

		const formData = await request.formData();
		const lockStatus = formData.get('locked');
		const insertLock = lockStatus === 'true' ? true : false;
		console.log(insertLock, typeof insertLock);

		const res = await db
			.update(sessions)
			.set({ locked: insertLock })
			.where(and(eq(sessions.slug, String(params.slug)), eq(sessions.owner, userId)));

		console.log('Successfully updated lock status');
		if (res) {
			return { editLockedSuccess: true };
		}
	},
} satisfies Actions;

function getInitSequence(result: object[]) {
	let sequence = '';
	let sequenceCutLastChar = sequence.length - 1;

	for (let i = 0; i < result.length; i++) {
		if (i === 0) {
			sequence = String(result[i].id);
		} else {
			sequence = sequence + ',' + result[i].id;
		}
	}
	sequence.slice(sequenceCutLastChar);
	return sequence;
}

function validateFileUpload(data: string[]) {
	const grades = ['A', 'B', 'C+', 'C', 'C-', 'D'];
	let gradePreCleaning = String(data[2]);
	let gradeInLoop = gradePreCleaning.toUpperCase();

	if (data.length !== 4 || data[0] === '' || data[1] === '' || data[2] === '') {
		return false;
	}
	if (data[0] === 'Name' || data[1] === 'Dept' || data[2] === 'Grade') {
		return false;
	}
	if (!grades.includes(gradeInLoop)) {
		return false;
	}
	return true;
}

async function dbInsertCsvRows(sessionId: string, data: string[][], db: any, dbLargestSequence: number) {
	let currentLargestSequence = dbLargestSequence;
	let sequenceToInsert;
	console.log('very outside: ', currentLargestSequence);
	for (let i = 0; i < data.length; i++) {
		if (!data[i][0] || !data[i][1] || !data[i][2] || !data[i][3]) {
			break;
		}
		console.log('Outside: ', currentLargestSequence);
		let gradePreCleaning = String(data[i][2]);
		let gradeInLoop = gradePreCleaning.toUpperCase();
		if (validateFileUpload(data[i])) {
			sequenceToInsert = currentLargestSequence + 1;
			currentLargestSequence += 1;

			console.log('Inside currentLargestSequence: ', currentLargestSequence);
			console.log('Inside sequenceToInsert: ', sequenceToInsert);
			await db.insert(records).values({
				name: data[i][0],
				dept: data[i][1],
				grade: gradeInLoop,
				session: sessionId,
				sequence: sequenceToInsert,
				remarks: data[i][3],
			});
		}
	}
}

async function checkUserIsSessionOwner(db: any, currentUser: string) {
	const user = await db.select({ owner: sessions.owner }).from(sessions).where(eq(sessions.owner, currentUser));
	if (user.length === 0) {
		return false;
	}
	return true;
}
