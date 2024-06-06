import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';
import { CONNECTION_STRING } from '$env/static/private';

const client = postgres(CONNECTION_STRING);
const migrationsClient = postgres(CONNECTION_STRING, {
	max: 1,
});

export const db = drizzle(client, { schema });
