import type { NextAuthConfig } from 'next-auth';
 
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
            return false; // Redirect unauthenticated users to login page
        } else if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
    },
  },
  /* The providers option is an array where you list different login options (empty for now) to satisfy NextAuth config. */
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;