import type { Metadata } from 'next';
import { Montserrat, Manrope } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bookmart | Buy & Sell Used Books Near You',
  description:
    'The ultimate peer-to-peer marketplace for pre-loved books. Buy cheap textbooks, novel editions, and rare literature directly from students and readers in your local community.',
  keywords: [
    'buy used books',
    'sell textbooks',
    'student book exchange',
    'second hand books online',
    'local book marketplace',
  ],
  openGraph: {
    title: 'Bookmart | Buy & Sell Used Books Near You',
    description:
      'Save up to 70% on textbooks and literature. List your books in seconds via barcode scan.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://bookmart.gourabacharjee.website',
    siteName: 'Bookmart',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${manrope.variable} font-body h-full antialiased`}>{children}</body>
    </html>
  );
}
