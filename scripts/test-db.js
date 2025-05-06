import postgres from 'postgres';

const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'nextjs_dashboard',
  username: 'mcfly',
  password: '',
  ssl: false,
});

async function testDB() {
  try {
    console.log('Connected to PostgreSQL');
    
    // Test query
    const result = await sql.unsafe('SELECT NOW()');
    console.log('Current time:', result[0].now);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sql.end();
  }
}

testDB(); 