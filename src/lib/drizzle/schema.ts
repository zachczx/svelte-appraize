import { relations, sql } from 'drizzle-orm';
import { pgTable, integer, uuid, boolean, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: varchar('id', { length: 50 }).primaryKey(),
	email: varchar('email', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }),
	timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

export const sessions = pgTable('sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 500 }).notNull(),
	timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
	owner: varchar('owner', { length: 50 }).references(() => users.id, { onDelete: 'cascade' }),
});

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
	talent: boolean('talent').default(false),
	remarks: varchar('remarks', { length: 1000 }),
	timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
	owner: varchar('owner', { length: 50 }).references(() => users.id, { onDelete: 'cascade' }),
});
