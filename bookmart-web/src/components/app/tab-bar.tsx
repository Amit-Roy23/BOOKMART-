'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IoAddCircle,
  IoAddCircleOutline,
  IoBarChart,
  IoBarChartOutline,
  IoHome,
  IoHomeOutline,
  IoPerson,
  IoPersonOutline,
} from 'react-icons/io5';
import { cn } from '@/lib/utils';

// Same four tabs as bookmart-app/app/(tabs): home, create, analytics, profile.
export const TABS = [
  { href: '/', label: 'Home', icon: IoHomeOutline, activeIcon: IoHome },
  { href: '/sell', label: 'Sell a book', icon: IoAddCircleOutline, activeIcon: IoAddCircle },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: IoBarChartOutline,
    activeIcon: IoBarChart,
  },
  { href: '/profile', label: 'Profile', icon: IoPersonOutline, activeIcon: IoPerson },
] as const;

export const TAB_ROUTES: string[] = TABS.map((t) => t.href);

/** Floating pill tab bar from the app (CustomTabBar). */
export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-4 z-50 mx-auto flex h-[58px] w-[74%] max-w-[360px] items-center rounded-[29px] border border-[rgba(0,128,128,0.08)] bg-white px-1.5 shadow-float"
    >
      {TABS.map(({ href, label, icon: Icon, activeIcon: ActiveIcon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className="flex h-full flex-1 items-center justify-center"
          >
            <span
              className={cn(
                'flex h-[46px] w-full items-center justify-center rounded-3xl transition-all duration-300',
                active
                  ? 'border-[1.2px] border-[rgba(0,128,128,0.18)] bg-[rgba(0,128,128,0.12)] text-primary'
                  : 'text-muted hover:text-primary'
              )}
            >
              {active ? (
                <ActiveIcon size={26} className="scale-110 transition-transform" />
              ) : (
                <Icon size={24} />
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
