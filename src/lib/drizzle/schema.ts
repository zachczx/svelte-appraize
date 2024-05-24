import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const records = sqliteTable('records', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	dept: text('dept').notNull(),
	grade: text('grade').notNull(),
	session: integer('session', { mode: 'number' }).notNull(),
	createdAt: integer('created_at')
		.notNull()
		.default(sql`(cast (unixepoch() as int))`),
});
