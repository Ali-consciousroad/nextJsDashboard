// Adding a primary font
import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// Adding a secondary font
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
});