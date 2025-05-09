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
      path: '../fonts/Lusitana-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Lusitana-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-lusitana',
});