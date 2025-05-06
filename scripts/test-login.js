const { query } = require('../app/lib/db');
const bcrypt = require('bcryptjs');

async function testLogin() {
    try {
        console.log('Testing login process...');
        
        // 1. Test database connection
        console.log('Testing database connection...');
        const testResult = await query('SELECT 1 as test');
        console.log('Database connection test:', testResult.rows[0].test === 1 ? 'Success' : 'Failed');
        
        // 2. Test user lookup
        console.log('\nTesting user lookup...');
        const email = 'user@nextmail.com';
        const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('User lookup result:', userResult.rows[0] ? 'User found' : 'No user found');
        
        if (userResult.rows[0]) {
            // 3. Test password comparison
            console.log('\nTesting password comparison...');
            const password = '123456';
            const passwordsMatch = await bcrypt.compare(password, userResult.rows[0].password);
            console.log('Password comparison result:', passwordsMatch ? 'Match' : 'No match');
            
            // 4. Print user details (excluding password)
            const { password: _, ...userDetails } = userResult.rows[0];
            console.log('\nUser details:', userDetails);
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testLogin(); 