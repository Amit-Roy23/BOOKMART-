import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/info-page';

export const metadata: Metadata = { title: 'FAQs' };

const FAQS = [
  {
    q: 'How do I buy a book?',
    a: 'Open a listing and tap “Contact seller on WhatsApp”. You agree on the price and pickup directly with the seller. Bookmart logs the contact under Contacts so you can find it later.',
  },
  {
    q: 'How do I sell a book?',
    a: 'Click “Sell a book”, search for the title (we fill in details from our catalog or OpenLibrary), upload photos of the front cover, back cover, spine and a middle page, set the condition and price, and choose a pickup location.',
  },
  {
    q: 'Why do I need four photos?',
    a: 'Clear photos of the cover, spine and pages let buyers judge the condition before contacting you, which means fewer wasted chats and faster sales.',
  },
  {
    q: 'Does Bookmart take a commission?',
    a: 'No. Buyers and sellers deal directly. The only paid feature is the optional Boost, which features your listing at the top of the feed.',
  },
  {
    q: 'What does boosting do?',
    a: 'A boosted listing appears in the Featured row on the home feed and carries a Featured badge in search and on the map for the length of the plan you choose.',
  },
  {
    q: 'How are “books near you” found?',
    a: 'When you allow location access we search listings within the radius you pick. Sellers set a pickup point on the map when they list a book.',
  },
  {
    q: 'I can’t find the book I need.',
    a: 'Post a book request with your budget and preferred condition. It appears on the Requests board so sellers who have it can reach out.',
  },
  {
    q: 'How do I report a suspicious listing or user?',
    a: 'Use “Report this listing” on a listing page or “Report user” on a seller’s profile. You can track the status of your reports under Profile → My reports.',
  },
];

export default function FaqsPage() {
  return (
    <InfoPage
      title="Frequently asked questions"
      intro="Quick answers about buying and selling on Bookmart."
    >
      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
              {q}
              <span className="text-xl text-brand-primary transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{a}</p>
          </details>
        ))}
      </div>
    </InfoPage>
  );
}
