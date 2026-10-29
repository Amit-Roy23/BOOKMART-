'use client';

import { usePathname } from 'next/navigation';
import { TAB_ROUTES, TabBar } from '@/components/app/tab-bar';
import { cn } from '@/lib/utils';

/** App shell: like bookmart-app, the floating tab bar shows only on the four tab screens. */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showTabs = TAB_ROUTES.includes(pathname);
  return (
    <div className="min-h-screen bg-app-bg">
      <main className={cn('mx-auto w-full max-w-[1100px]', showTabs ? 'pb-28' : 'pb-10')}>
        {children}
      </main>
      {showTabs && <TabBar />}
    </div>
  );
}
