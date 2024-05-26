import { relations, sql } from 'drizzle-orm';
import { pgTable, integer, uuid, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const records = pgTable('records', {
	id: serial('serial').primaryKey(),
	uuid: uuid('uuid').defaultRandom(),
	name: text('name').notNull(),
	dept: text('dept').notNull(),
	grade: text('grade').notNull(),
	session: text('session').notNull(),
	timestamp: timestamp('timestamp3').defaultNow(),
});
