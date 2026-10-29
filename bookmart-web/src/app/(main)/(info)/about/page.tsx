import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/layout/info-page';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <InfoPage
      title="About Bookmart"
      intro="Your campus library companion — a peer-to-peer marketplace for pre-loved books."
    >
      <InfoSection title="Why we built it">
        <p>
          Every semester students buy expensive textbooks that they only need for a few months,
          while the copies from last year gather dust. Bookmart connects the two, so books keep
          moving and everyone saves.
        </p>
      </InfoSection>
      <InfoSection title="What you can do">
        <p>
          Browse books near you on a map, search by title, author, genre or condition, save
          favourites, request books you can’t find, and sell your own in a few steps — on the web or
          in the Bookmart mobile app, with the same account.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
