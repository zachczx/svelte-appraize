import { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/lib/drizzle/schema.ts',
	out: './src/lib/drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	},
} satisfies Config;
