import { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/lib/drizzle/schema.ts',
	out: './src/lib/drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		host: String(process.env.DB_HOST),
		port: Number(process.env.DB_PORT),
		user: String(process.env.DB_USER),
		password: String(process.env.DB_PASSWORD),
		database: String(process.env.DB_NAME),
		ssl: false,
	},
} satisfies Config;
