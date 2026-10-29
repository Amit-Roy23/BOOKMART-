'use client';

import { ArrowDownLeft, ArrowUpRight, MessageCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Avatar,
  Chip,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@/components/ui/primitives';
import { useContacts } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, formatDate, formatPrice } from '@/lib/utils';

export default function ContactsPage() {
  const { data: contacts = [], isLoading, isError, error, refetch } = useContacts();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'ALL' | 'BOUGHT' | 'SOLD'>('ALL');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter(
      (c) =>
        (type === 'ALL' || c.deal_type === type) &&
        (!q ||
          c.contact_person_name.toLowerCase().includes(q) ||
          c.book_title.toLowerCase().includes(q))
    );
  }, [contacts, query, type]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Contacts"
        description="Sellers you’ve contacted on WhatsApp and buyers you’ve sold to."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or book"
            aria-label="Search contacts"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <Chip active={type === 'ALL'} onClick={() => setType('ALL')}>
            All
          </Chip>
          <Chip active={type === 'BOUGHT'} onClick={() => setType('BOUGHT')}>
            Buying
          </Chip>
          <Chip active={type === 'SOLD'} onClick={() => setType('SOLD')}>
            Selling
          </Chip>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-48" />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No contacts yet"
          description="When you contact a seller on WhatsApp from a listing it will be logged here."
        />
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
          {shown.map((c) => {
            const bought = c.deal_type === 'BOUGHT';
            return (
              <li key={c.id} className="flex items-center gap-3 p-4">
                <Avatar name={c.contact_person_name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{c.contact_person_name}</p>
                  <p className="truncate text-sm text-slate-500">{c.book_title}</p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold',
                      bought ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'
                    )}
                  >
                    {bought ? (
                      <ArrowDownLeft className="h-3 w-3" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                    {bought ? 'Buying' : 'Sold'}
                  </span>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatPrice(c.price_recorded)}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(c.transaction_date)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
