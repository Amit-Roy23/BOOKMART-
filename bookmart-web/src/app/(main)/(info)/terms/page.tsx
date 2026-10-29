import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/info-page';

export const metadata: Metadata = { title: 'Terms & conditions' };

export default function TermsPage() {
  return <InfoPage title="Terms & conditions" />;
}
