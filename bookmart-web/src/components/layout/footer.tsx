import { BookOpen } from 'lucide-react';
import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Marketplace',
    links: [
      { href: '/search', label: 'Browse books' },
      { href: '/categories', label: 'Categories' },
      { href: '/nearby', label: 'Books near you' },
      { href: '/requests', label: 'Book requests' },
    ],
  },
  {
    title: 'Sellers',
    links: [
      { href: '/sell', label: 'Sell a book' },
      { href: '/dashboard/listings', label: 'Manage listings' },
      { href: '/dashboard/boost', label: 'Boost a listing' },
      { href: '/dashboard/analytics', label: 'Analytics' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/help', label: 'Help & support' },
      { href: '/faqs', label: 'FAQs' },
      { href: '/about', label: 'About' },
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms & conditions' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-3 inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="text-xl font-bold text-white">Bookmart</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed">
              Your campus library companion. Buy and sell pre-loved books with students and readers
              near you.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-bold text-white">{col.title}</h3>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-slate-800 pt-6 text-xs">
          © {new Date().getFullYear()} Bookmart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
