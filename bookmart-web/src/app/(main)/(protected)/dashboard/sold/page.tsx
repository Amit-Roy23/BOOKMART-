'use client';

import { IndianRupee, PackageCheck, Plus, Search, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  BookCover,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  Select,
  Skeleton,
} from '@/components/ui/primitives';
import { useContacts, useLogContact, useMyListings, useUpdateListingStatus } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { formatDate, formatPrice, listingCover } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';

type Sort = 'recent' | 'price_desc' | 'oldest';

export default function SoldBooksPage() {
  const toast = useToast();
  const { data: listings = [], isLoading } = useMyListings();
  const { data: contacts = [] } = useContacts();
  const logContact = useLogContact();
  const updateStatus = useUpdateListingStatus();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('recent');
  const [recording, setRecording] = useState(false);
  const [form, setForm] = useState({ listing: '', buyer: '', price: '' });

  const soldListings = useMemo(() => listings.filter((l) => l.status === 'SOLD'), [listings]);
  const available = useMemo(() => listings.filter((l) => l.status === 'AVAILABLE'), [listings]);
  const sales = useMemo(() => contacts.filter((c) => c.deal_type === 'SOLD'), [contacts]);
  // Match each sold listing to the most recent buyer recorded for it in the ledger, if any.
  const saleByTitle = useMemo(() => {
    const map = new Map<string, (typeof sales)[number]>();
    for (const sale of sales) if (!map.has(sale.book_title)) map.set(sale.book_title, sale);
    return map;
  }, [sales]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = soldListings.filter(
      (l) =>
        !q ||
        l.book.title.toLowerCase().includes(q) ||
        saleByTitle.get(l.book.title)?.contact_person_name.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => {
      if (sort === 'price_desc') return parseFloat(b.price) - parseFloat(a.price);
      const diff = new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return sort === 'oldest' ? -diff : diff;
    });
  }, [soldListings, saleByTitle, query, sort]);

  const earned = soldListings.reduce((sum, l) => sum + parseFloat(l.price), 0);

  const record = async (e: React.FormEvent) => {
    e.preventDefault();
    const listing = available.find((l) => l.id === Number(form.listing));
    if (!listing) return toast.error('Choose the book you sold.');
    if (!form.buyer.trim()) return toast.error('Enter the buyer’s name.');
    try {
      await logContact.mutateAsync({
        contact_person_name: form.buyer.trim(),
        book_title: listing.book.title,
        deal_type: 'SOLD',
        price_recorded: form.price || listing.price,
      });
      await updateStatus.mutateAsync({ id: listing.id, status: 'SOLD' });
      toast.success('Sale recorded and listing marked as sold');
      setRecording(false);
      setForm({ listing: '', buyer: '', price: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sold books"
        description="Books you’ve sold and what you’ve earned."
        action={
          available.length > 0 && (
            <Button onClick={() => setRecording(true)}>
              <Plus className="h-4 w-4" /> Record a sale
            </Button>
          )
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Card className="p-4">
          <PackageCheck className="h-5 w-5 text-brand-primary" />
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{soldListings.length}</p>
          <p className="text-xs text-slate-500">Books sold</p>
        </Card>
        <Card className="p-4">
          <IndianRupee className="h-5 w-5 text-emerald-600" />
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatPrice(earned)}</p>
          <p className="text-xs text-slate-500">Total earned</p>
        </Card>
        <Card className="col-span-2 p-4 md:col-span-1">
          <UserRound className="h-5 w-5 text-sky-600" />
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{sales.length}</p>
          <p className="text-xs text-slate-500">Buyers recorded</p>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or buyer"
            aria-label="Search sold books"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Sort sold books"
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
        >
          <option value="recent">Most recent</option>
          <option value="price_desc">Price: high to low</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {isLoading ? (
        <Skeleton className="h-40" />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={PackageCheck}
          title={soldListings.length ? 'No sold books match your search' : 'No sold books yet'}
          description="When you mark a listing as sold it will appear here."
          action={
            <Link href="/dashboard/listings">
              <Button variant="outline">Manage listings</Button>
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {shown.map((l) => {
            const sale = saleByTitle.get(l.book.title);
            return (
              <li
                key={l.id}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-3"
              >
                <Link
                  href={`/listings/${l.id}`}
                  className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100"
                >
                  <BookCover src={listingCover(l)} alt={l.book.title} />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-bold text-slate-900">{l.book.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <UserRound className="h-3.5 w-3.5" />
                    {sale ? `Sold to ${sale.contact_person_name}` : 'Buyer not recorded'}
                  </p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="font-extrabold text-brand-dark">
                      {formatPrice(sale?.price_recorded ?? l.price)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(sale?.transaction_date ?? l.updated_at)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal open={recording} onClose={() => setRecording(false)} title="Record a sale">
        <form onSubmit={record} className="space-y-4">
          <Select
            label="Book"
            value={form.listing}
            onChange={(e) => {
              const l = available.find((x) => x.id === Number(e.target.value));
              setForm({
                ...form,
                listing: e.target.value,
                price: l ? String(parseFloat(l.price)) : '',
              });
            }}
          >
            <option value="">Select a listing</option>
            {available.map((l) => (
              <option key={l.id} value={l.id}>
                {l.book.title} — {formatPrice(l.price)}
              </option>
            ))}
          </Select>
          <Input
            label="Buyer name"
            value={form.buyer}
            onChange={(e) => setForm({ ...form, buyer: e.target.value })}
            required
          />
          <Input
            label="Final price (₹)"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setRecording(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={logContact.isPending || updateStatus.isPending}>
              Save sale
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
