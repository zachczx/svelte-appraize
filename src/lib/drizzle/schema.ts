import { relations, sql } from 'drizzle-orm';
import { pgTable, integer, uuid, boolean, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const records = pgTable('records', {
	id: serial('serial').primaryKey(),
	uuid: uuid('uuid').defaultRandom(),
	name: text('name').notNull(),
	dept: text('dept').notNull(),
	grade: text('grade').notNull(),
	session: text('session').notNull(),
	sequence: integer('sequence'),
	previous: boolean('boolean'),
	timestamp: timestamp('timestamp3').defaultNow(),
});
