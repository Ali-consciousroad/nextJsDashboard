const { Pool } = require('pg');

const pool = new Pool({
  user: 'mcfly',
  host: 'localhost',
  database: 'nextjs_dashboard',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

module.exports = pool; 