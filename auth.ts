// Spread the authConfig object
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { sql } from '@/app/lib/db';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';

async function getUser(email: string): Promise<User | undefined> {
    try {
        const result = await sql`
            SELECT * FROM users 
            WHERE email = ${email}
        `;
        return result[0] as User;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || 'your-super-secret-key-here',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    ...authConfig.pages,
    signIn: '/login',
    error: '/login',
  },
});