import { db } from '$lib/drizzle/db';
import { records, sessions, users } from '$lib/drizzle/schema';
import { redirect } from '@sveltejs/kit';
import { eq, count } from 'drizzle-orm';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ locals }) => {
	const { userId } = locals.auth();

	if (!userId) {
		return redirect(307, '/login');
	}
	const sq = db
		.select({ session: records.session, count: count(records.session).as('count') })
		.from(records)
		.groupBy(records.session)
		.as('sq');

	const result = await db
		.select({
			id: sessions.id,
			title: sessions.title,
			timestamp: sessions.timestamp,
			owner: sessions.owner,
			slug: sessions.slug,
			count: sq.count,
		})
		.from(sessions)
		.leftJoin(sq, eq(sessions.id, sq.session))
		.where(eq(sessions.owner, userId));

	return { result };
};
