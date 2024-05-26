import { relations, sql } from 'drizzle-orm';
import { pgTable, integer, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const records = pgTable('records', {
	id: serial('serial').primaryKey(),
	name: text('name').notNull(),
	dept: text('dept').notNull(),
	grade: text('grade').notNull(),
	session: integer('session').notNull(),
	timestamp: timestamp('timestamp3').defaultNow(),
});
