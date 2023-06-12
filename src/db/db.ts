import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../env/server.mjs';

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);
