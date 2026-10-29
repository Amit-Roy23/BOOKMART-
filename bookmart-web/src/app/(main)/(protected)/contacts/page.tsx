'use client';

import { useMemo, useState } from 'react';
import {
  IoBookOutline,
  IoChatbubblesOutline,
  IoLogoWhatsapp,
  IoSearchOutline,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { Avatar, EmptyState, ErrorState, Skeleton } from '@/components/ui/primitives';
import { useContacts } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/utils';

/** “Contact History” — the app's ContactScreen, backed by the contacts ledger. */
export default function ContactsPage() {
  const { data: contacts = [], isLoading, isError, error, refetch } = useContacts();
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter(
      (c) =>
        !q ||
        c.contact_person_name.toLowerCase().includes(q) ||
        c.book_title.toLowerCase().includes(q)
    );
  }, [contacts, query]);

  return (
    <div className="mx-auto max-w-3xl">
      <ScreenHeader
        title="Contact History"
        fallback="/profile"
        right={
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-app-green shadow-card">
            <IoLogoWhatsapp size={22} />
          </span>
        }
      />
      <div className="space-y-5 px-6">
        <div className="flex h-12 items-center gap-2 rounded-3xl bg-white px-4 shadow-card">
          <IoSearchOutline size={18} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, book or message..."
            aria-label="Search contacts"
            className="h-full flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>

        {isLoading ? (
          <Skeleton className="h-24" />
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        ) : shown.length === 0 ? (
          <div className="pt-[10vh]">
            <EmptyState
              icon={IoChatbubblesOutline}
              title="No Contacts Yet"
              description="Sellers you contact on WhatsApp and buyers you sell to will show up here."
            />
          </div>
        ) : (
          <section>
            <h2 className="font-heading mb-3 text-xs font-bold tracking-[0.15em] text-muted">
              RECENT CHATS
            </h2>
            <ul className="space-y-3">
              {shown.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card"
                >
                  <Avatar name={c.contact_person_name} size={52} className="bg-app-bg text-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-heading truncate text-base font-bold text-ink">
                        {c.contact_person_name}
                      </p>
                      <span className="shrink-0 text-xs text-muted">
                        {formatDate(c.transaction_date, { year: undefined })}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex max-w-[70%] items-center gap-1 truncate rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                        <IoBookOutline size={11} /> {c.book_title}
                      </span>
                      <span className="text-[11px] text-muted">
                        {c.deal_type === 'SOLD' ? 'Sold' : 'Buying'} ·{' '}
                        {formatPrice(c.price_recorded)}
                      </span>
                    </div>
                  </div>
                  <IoLogoWhatsapp size={22} className="shrink-0 text-app-green" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
