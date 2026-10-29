'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoader } from '@/components/ui/primitives';
import { useAuth } from '@/providers/auth-provider';

/** Gate a subtree behind login; anonymous visitors are sent to /login and returned after. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status !== 'authenticated') return <PageLoader />;
  return <>{children}</>;
}
