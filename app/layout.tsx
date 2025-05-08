// Shared root layout (required)
import '@/app/ui/global.css';
import { inter, lusitana } from '@/app/ui/fonts';
// Any metadata in layout.js will be inherited by all pages that use it.
// Next.js will automatically add the title and metadata to your application.
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js course dashboard built with App router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lusitana.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
