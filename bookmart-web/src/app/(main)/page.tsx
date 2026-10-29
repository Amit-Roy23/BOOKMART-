'use client';

import { HomeFeedView } from '@/components/home/home-feed';
import { Landing } from '@/components/home/landing';
import { PageLoader } from '@/components/ui/primitives';
import { useAuth } from '@/providers/auth-provider';

export default function HomePage() {
  const { status } = useAuth();
  if (status === 'loading') return <PageLoader />;
  return status === 'authenticated' ? <HomeFeedView /> : <Landing />;
}
