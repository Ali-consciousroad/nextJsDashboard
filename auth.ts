// Spread the authConfig object
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
// We use zod to validate the email and password before checking if the user exists in the DB.
import { z } from 'zod';
import { db } from '@/app/lib/db';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';

async function getUser(email: string): Promise<User | undefined> {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                    if (parsedCredentials.success) {
                        const { email, password } = parsedCredentials.data;
                        const user = await getUser(email);
                        if (!user) return null;
                        const passwordsMatch = await bcrypt.compare(password, user.password);
                        if (passwordsMatch) return user; 
                    }
                    console.log('Invalid credentials');
                    return null;
                },
            }),  
        ],
});