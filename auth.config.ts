import type { NextAuthConfig } from 'next-auth';
import { sql } from '@vercel/postgres';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

async function getUser(email: string) {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export const authConfig = {
  pages: {
    /* Not required but by adding this option, 
    the user will be redirected to our custom login page. */
    signIn: '/login', 
  },
  // The authorized callback is used to verify if the request is authorized to access a page with Next.js Middleware.
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  /* The providers option is an array where you list different login options (empty for now) to satisfy NextAuth config. */
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;