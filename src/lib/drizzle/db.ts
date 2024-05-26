import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const client = new pg.Client({
	connectionString: process.env.CONNECTION_STRING,
});
await client.connect();
export const db = drizzle(client, { schema });
