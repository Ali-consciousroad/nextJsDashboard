import postgres from 'postgres';

const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'nextjs_dashboard',
  username: 'mcfly',
  password: '',
  ssl: false,
});

export { sql }; 