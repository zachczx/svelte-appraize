import { db } from '$lib/drizzle/db';
import { records } from '$lib/drizzle/schema';
import { desc, asc, eq, and, or, as, ilike } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

//superforms
import { z } from 'zod';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// R2 Bucket imports
import { PUBLIC_S3_BUCKET_NAME } from '$env/static/public'; //it's a public key, so prefix PUBLIC_ requires fetching from public, not private
import { R2_S3 } from '$lib/R2_S3';
import { Upload } from '@aws-sdk/lib-storage';

//For Buffer/Handling of file
import * as fs from 'fs';
import Papa from 'papaparse';

/**
 *
 * @param time integer in milliseconds
 * @returns
 */
let delay = (time) => {
	return new Promise((res) => {
		setTimeout(res, time);
	});
};

const regexRoute = /^[a-zA-Z0-9-]*$/;

/**
 *
 * @param str get rid of weird characters in filename, from cloudflare r2 upload
 * @returns
 */
const slugifyString = (str: string) => {
	return str
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/\./g, '-')
		.replace(/-+/g, '-')
		.replace(/[^a-z0-9-]/g, '-');
};

export const load = (async ({ params, url }) => {
	const sessionId = String(params.id);
	const filterParam = url.searchParams.get('filter');
	const filterGradeParam = url.searchParams.get('grade');
	//console.log(`Found a param, ${filterParam}`);
	let result;
	if (!filterParam || !filterGradeParam) {
		const sq = db.select().from(records).where(eq(records.session, sessionId)).as('sq');
		result = await db
			.select()
			.from(sq)
			.where(
				or(
					filterParam ? ilike(sq.name, `%${filterParam}%`) : undefined,
					filterParam ? ilike(sq.dept, `%${filterParam}%`) : undefined,
					filterParam ? ilike(sq.remarks, `%${filterParam}%`) : undefined,
					filterGradeParam ? eq(sq.grade, filterGradeParam) : undefined,
				),
			)
			.orderBy(asc(sq.sequence));

		/*result = await db
			.select()
			.from(records)
			.where(
				and(
					eq(records.session, sessionId),
					filterParam ? ilike(records.name, `%${filterParam}%`) : undefined,
					filterGradeParam ? eq(records.grade, filterGradeParam) : undefined,
				),
			)
			.orderBy(asc(records.sequence)); */
	} else if (filterParam && filterGradeParam) {
		result = await db
			.select()
			.from(records)
			.where(
				and(
					eq(records.session, sessionId),
					or(ilike(records.name, `%${filterParam}%`), ilike(records.dept, `%${filterParam}%`)),
					eq(records.grade, filterGradeParam),
				),
			)
			.orderBy(asc(records.sequence));
	} else {
		result = await db.select().from(records).where(eq(records.session, sessionId)).orderBy(asc(records.sequence));
	}

	//console.log(result);

	return {
		id: sessionId,
		streamed: {
			result,
			//delay: await delay(5000),
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
		if (!submittedData.get('name')) {
			return fail(400, { insertNameMissing: true });
		}
		if (!submittedData.get('dept')) {
			return fail(400, { insertDeptMissing: true });
		}
		if (!submittedData.get('grade')) {
			return fail(400, { insertGradeMissing: true });
		}
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
		const editName = String(editData.get('edit-person-name')).trim();
		const editDept = String(editData.get('edit-person-dept')).trim();
		const editRemarks = String(editData.get('edit-person-remarks')).trim();

		if (!editName || editName == '' || !editDept || editDept == '') {
			return { editInsertFailedGrade: true };
		} else {
			console.log('Name: ', editName, '\n', 'Dept: ', editDept, '\n', 'Remarks: ', editRemarks);
			await db
				.update(records)
				.set({ name: editName, dept: editDept, remarks: editRemarks })
				.where(eq(records.id, editTarget));
			return { editInsertSuccess: true };
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
		const deleteData = await request.formData();
		const delTarget = deleteData.get('delete-target');
		//give a delay so delete animation can finish
		await delay(500);
		await db.delete(records).where(eq(records.id, delTarget));
	},

	save: async function ({ request, params }) {
		try {
			const sessionId = String(params.id);
			const saveData = await request.formData();

			// Grab the sortable order
			const orderInput = saveData.get('order');
			const orderArray = orderInput.split(',');

			for (let i = 0; i < orderArray.length; i++) {
				let individualOrder = i + 1;
				console.log(individualOrder, orderArray[i]);
				await db
					.update(records)
					.set({ sequence: individualOrder })
					.where(and(eq(records.session, sessionId), eq(records.uuid, orderArray[i])));
			}

			// Delay for the spinner icon/toast
			await delay(1000);
			console.log('Order saved successfully');
			return { formSaveSuccess: true };
		} catch (error) {
			console.log("There's an error:");
			console.log(error);
			await delay(1000);
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

	filter: async function ({ request, params }) {
		const rawFormInput = await request.formData();
		const sessionId = String(params.id);
		let filterFormInput;
		let filterFormGradeInput;
		let finalUrlString;

		if (rawFormInput.get('filter')) {
			filterFormInput = 'filter=' + String(rawFormInput.get('filter')).trim();
			console.log('Server received filter string: ', filterFormInput);
		}

		if (
			rawFormInput.get('grade') === 'A' ||
			rawFormInput.get('grade') === 'B' ||
			rawFormInput.get('grade') === 'C+' ||
			rawFormInput.get('grade') === 'C' ||
			rawFormInput.get('grade') === 'C-' ||
			rawFormInput.get('grade') === 'D'
		) {
			filterFormGradeInput = 'grade=' + String(rawFormInput.get('grade'));
			console.log('Server received filter string: ', filterFormGradeInput);
		} else if (rawFormInput.get('grade') === 'All') {
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
		redirect(307, `/v/${sessionId}/?${finalUrlString}`);
	},

	redirect: async function ({ request }) {
		const inputData = await request.formData();
		const inputSession = inputData.get('session');
		const inputSessionTrimmed = inputSession.trim();
		if (regexRoute.test(inputSessionTrimmed)) {
			redirect(307, `/v/${inputSessionTrimmed}`);
		} else {
			return fail(400, { formRedirectFailed: true });
		}
	},

	uploadfile: async function ({ request, params }) {
		const formData = await request.formData();
		const sessionId = String(params.id);
		const file = formData.get('fileupload');
		// console.log(file);
		const fileBuffer = Buffer.from(await file.arrayBuffer()); //readable after upload to r2
		const fileBuffertoString = fileBuffer.toString();
		// console.log(fileBuffertoString);
		const arrayFile = Papa.parse(fileBuffertoString);
		// console.log(arrayFile.data);

		/**
		 * @param {Object[]} data - Data object output from Papaparse
		 * @param {string} data[][0] - Name
		 * @param {string} data[][1] - Dept
		 * @param {string} data[][2] - Grade A/B/C+/C/C-/D
		 * @param {string} data[][3] - Remarks (optional)
		 */
		const data = arrayFile.data;
		// console.log(data.length);
		for (let i = 0; i < data.length; i++) {
			console.log(data[i][2]);
			let gradePreCleaning = String(data[i][2]);
			let gradeInLoop = gradePreCleaning.toUpperCase();
			// console.log(gradeInLoop);
			if (
				data[i].length === 4 &&
				data[i][0] != '' &&
				data[i][1] != '' &&
				data[i][0] != 'Name' &&
				data[i][1] != 'Dept' &&
				data[i][2].includes('Grade') === false &&
				(gradeInLoop === 'A' ||
					gradeInLoop === 'B' ||
					gradeInLoop === 'C+' ||
					gradeInLoop === 'C' ||
					gradeInLoop === 'C-' ||
					gradeInLoop != 'D')
			) {
				let currentLargestSequence = await db
					.select()
					.from(records)
					.where(eq(records.session, sessionId))
					.orderBy(desc(records.sequence))
					.limit(1);
				let sequenceToInsert;
				if (currentLargestSequence == 0) {
					sequenceToInsert = 1;
				} else {
					sequenceToInsert = currentLargestSequence[0].sequence + 1;
				}

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

		// Upload to Cloudflare R2
		if (!file.name || file.name === undefined) {
			return fail(400, { error: true, message: 'You must provide a file to upload' });
		} else if (
			file.type != 'text/csv' ||
			!file.type ||
			file.name.trim() === '' ||
			file.type.trim() === '' ||
			file.size > 10000
		) {
			console.log('Fail, not a csv file');
			return fail(400, { error: true, message: 'You must upload a .csv file' });
		}

		const objectKey = `${slugifyString(Date.now().toString())}-${slugifyString(file.name)}.csv`;

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
			//console.log(progress);
		});

		await send.done();
		return { formUploadSuccess: true };
	},
};
