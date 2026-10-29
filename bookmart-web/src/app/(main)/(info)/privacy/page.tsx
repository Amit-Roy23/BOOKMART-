import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/info-page';

export const metadata: Metadata = { title: 'Privacy policy' };

export default function PrivacyPage() {
  return <InfoPage title="Privacy policy" />;
}
