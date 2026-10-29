'use client';

import { BarChart3, LayoutList, PackageCheck, Rocket } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/dashboard/listings', label: 'My listings', icon: LayoutList },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/boost', label: 'Boost', icon: Rocket },
  { href: '/dashboard/sold', label: 'Sold books', icon: PackageCheck },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="space-y-6">
      <nav className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto border-b border-slate-200 px-4 md:mx-0 md:px-0">
        {TABS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              '-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition',
              pathname.startsWith(href)
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
