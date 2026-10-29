import type { Metadata, Viewport } from 'next';
import { Montserrat, Manrope } from 'next/font/google';
import { Providers } from '@/providers';
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

// The app has no dark theme; opt out of browser auto-dark (Chrome/Brave night mode).
export const viewport: Viewport = { colorScheme: 'only light', themeColor: '#f4f9f9' };

export const metadata: Metadata = {
  title: {
    default: 'Bookmart | Buy & Sell Used Books Near You',
    template: '%s | Bookmart',
  },
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
    description: 'Save up to 70% on textbooks and literature. List your books in seconds.',
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
      <body className={`${montserrat.variable} ${manrope.variable} font-body antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
