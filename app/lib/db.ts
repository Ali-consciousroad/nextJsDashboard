import { Pool } from 'pg';
import { sql } from '@vercel/postgres';

// Check if we're running in a Vercel environment
const isVercel = process.env.VERCEL === '1';

// For local development
const localPool = new Pool({
  user: 'mcfly',
  host: 'localhost',
  database: 'nextjs_dashboard',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Export the appropriate database client based on environment
export const db = isVercel ? sql : localPool; 