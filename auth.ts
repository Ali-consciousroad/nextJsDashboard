// Spread the authConfig object
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { sql } from '@/app/lib/db';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';

async function getUser(email: string): Promise<User | undefined> {
    try {
        console.log('Attempting to fetch user with email:', email);
        const result = await sql`
            SELECT * FROM users 
            WHERE email = ${email}
        `;
        console.log('User query result:', result[0] ? 'User found' : 'No user found');
        if (result[0]) {
            console.log('User details:', {
                id: result[0].id,
                name: result[0].name,
                email: result[0].email
            });
            return result[0];
        }
        return undefined;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const result = await sql`
            SELECT * FROM users 
            WHERE email = ${credentials.email}
          `;
          
          const user = result[0];
          if (!user) return null;
          
          const passwordsMatch = credentials.password === user.password;
          if (!passwordsMatch) return null;
          
          return user;
        } catch (error) {
          console.error('Error:', error);
          return null;
        }
      }
    }
  ]
});