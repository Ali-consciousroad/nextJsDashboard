// Adding a primary font
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Configure Inter font
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Adding a secondary font
export const lusitana = localFont({
  src: [
    {
      path: '../fonts/woff2/Lusitana-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/woff2/Lusitana-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-lusitana',
  fallback: ['Georgia', 'serif'],
});