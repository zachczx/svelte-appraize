import { env } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const client = new pg.Client({
	connectionString: env.CONNECTION_STRING,
});
await client.connect();
export const db = drizzle(client, { schema });
