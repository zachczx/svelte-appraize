import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const records = sqliteTable('records', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	uuid: text('uuid').$defaultFn(() => createId()),
	name: text('name').notNull(),
	dept: text('dept').notNull(),
	grade: text('grade').notNull(),
	session: text('session').notNull(),
	sequence: integer('sequence'),
	remarks: text('remarks'),
	createdAt: integer('created_at')
		.notNull()
		.default(sql`(cast (unixepoch() as int))`),
});
