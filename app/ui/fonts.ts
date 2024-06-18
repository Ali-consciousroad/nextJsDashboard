// Adding a primary font
import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

// Adding a secondary font
export const lusitana = Lusitana({ 
    weight: ['400', '700'],
    subsets: ['latin'],
});