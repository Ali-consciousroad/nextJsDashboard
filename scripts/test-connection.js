import postgres from 'postgres';

const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'nextjs_dashboard',
  username: 'mcfly',
  password: '',
  ssl: false,
});

async function testConnection() {
  try {
    console.log('Connected to PostgreSQL');
    
    // Test query
    const result = await sql.unsafe('SELECT * FROM users WHERE email = $1', ['user@nextmail.com']);
    console.log('User found:', result.length > 0 ? 'Yes' : 'No');
    
    if (result.length > 0) {
      console.log('User details:', {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sql.end();
  }
}

testConnection(); 