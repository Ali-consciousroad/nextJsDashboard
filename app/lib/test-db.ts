import { sql } from './db';

async function testConnection() {
  try {
    // Try to execute a simple query
    const result = await sql`SELECT NOW()`;
    console.log('Database connection successful!');
    console.log('Current database time:', result[0].now);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Run the test
testConnection(); 