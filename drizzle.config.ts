import { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	dialect: 'sqlite',
	schema: './src/lib/drizzle/schema.ts',
	out: './src/lib/drizzle/migrations',
	driver: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
} satisfies Config;
