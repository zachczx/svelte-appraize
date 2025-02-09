import { relations, sql } from 'drizzle-orm';
import { pgTable, integer, uuid, boolean, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const records = pgTable('records', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	dept: text('dept').notNull(),
	grade: text('grade').notNull(),
	session: uuid('session')
		.references(() => sessions.id, { onDelete: 'cascade' })
		.notNull(),
	sequence: integer('sequence'),
	previous: boolean('previous'),
	remarks: varchar('remarks', { length: 1000 }),
	timestamp: timestamp('timestamp3').defaultNow(),
});

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }),
	timestamp: timestamp('timestamp3').defaultNow(),
});

export const sessions = pgTable('sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 255 }).notNull(),
	timestamp: timestamp('timestamp3').defaultNow(),
	owner: uuid('owner').references(() => users.id),
});
