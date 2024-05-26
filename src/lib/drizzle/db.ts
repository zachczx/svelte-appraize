import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import { CONNECTION_STRING } from '$env/static/private';

const client = new pg.Client({
	connectionString: CONNECTION_STRING,
});

/* const client = new pg.Client({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});
 */ await client.connect();
export const db = drizzle(client, { schema });
