const { sql } = require('@vercel/postgres');

async function deleteAllData() {
  try {
    // Delete data from all tables
    await sql`DELETE FROM revenue`;
    await sql`DELETE FROM invoices`;
    await sql`DELETE FROM customers`;
    await sql`DELETE FROM users`;
    
    console.log('All data deleted successfully');
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
}

// Run the delete function
deleteAllData().catch((err) => {
  console.error('An error occurred while deleting data:', err);
}); 