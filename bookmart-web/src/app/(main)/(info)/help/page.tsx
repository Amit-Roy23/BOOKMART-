import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, InfoSection } from '@/components/layout/info-page';

export const metadata: Metadata = { title: 'Help & support' };

export default function HelpPage() {
  return (
    <InfoPage title="Help & support" intro="Guides for the most common tasks on Bookmart.">
      <InfoSection title="Getting started">
        <p>
          Create an account with your email, enter the 4-digit code we email you, then tell us who
          you are and what you like to read so we can personalise your feed.
        </p>
        <p>
          Add a phone number in{' '}
          <Link href="/profile/edit" className="font-semibold text-brand-primary">
            Edit profile
          </Link>{' '}
          — buyers contact sellers on WhatsApp, so listings without a number can’t be contacted.
        </p>
      </InfoSection>
      <InfoSection title="Managing your listings">
        <p>
          In{' '}
          <Link href="/dashboard/listings" className="font-semibold text-brand-primary">
            Manage listings
          </Link>{' '}
          you can edit a listing, mark it as sold or available again, boost it, or delete it.
        </p>
        <p>
          When you sell a book, use{' '}
          <Link href="/dashboard/sold" className="font-semibold text-brand-primary">
            Record a sale
          </Link>{' '}
          to save who bought it and mark the listing as sold in one step.
        </p>
      </InfoSection>
      <InfoSection title="Account & security">
        <p>
          Forgot your password? Use{' '}
          <Link href="/forgot-password" className="font-semibold text-brand-primary">
            Reset password
          </Link>{' '}
          — we’ll email you a 4-digit code. Codes expire after 5 minutes.
        </p>
        <p>
          If someone is behaving suspiciously, report the listing or user. Never pay in advance to a
          seller you haven’t met.
        </p>
      </InfoSection>
      <InfoSection title="Still need help?">
        <p>
          Check the{' '}
          <Link href="/faqs" className="font-semibold text-brand-primary">
            FAQs
          </Link>{' '}
          for more answers.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
