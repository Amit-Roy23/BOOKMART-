'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  IoAdd,
  IoBagHandleOutline,
  IoCheckmark,
  IoCubeOutline,
  IoFilterOutline,
  IoPersonCircleOutline,
  IoSearchOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import {
  BookCover,
  Button,
  EmptyState,
  Input,
  Modal,
  Select,
  Skeleton,
} from '@/components/ui/primitives';
import { useContacts, useLogContact, useMyListings, useUpdateListingStatus } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, formatDate, formatPrice, listingCover } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';

// Layout follows the app's SoldBooksScreen; data comes from sold listings and the contacts ledger.

const SORTS = [
  { value: 'recent', label: 'Recent' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'date_asc', label: 'Date (Oldest First)' },
] as const;

export default function SoldBooksPage() {
  const toast = useToast();
  const { data: listings = [], isLoading } = useMyListings();
  const { data: contacts = [] } = useContacts();
  const logContact = useLogContact();
  const updateStatus = useUpdateListingStatus();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<(typeof SORTS)[number]['value']>('recent');
  const [sortOpen, setSortOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [form, setForm] = useState({ listing: '', buyer: '', price: '' });

  const sold = useMemo(() => listings.filter((l) => l.status === 'SOLD'), [listings]);
  const available = useMemo(() => listings.filter((l) => l.status === 'AVAILABLE'), [listings]);
  const saleByTitle = useMemo(() => {
    const map = new Map<string, (typeof contacts)[number]>();
    for (const c of contacts)
      if (c.deal_type === 'SOLD' && !map.has(c.book_title)) map.set(c.book_title, c);
    return map;
  }, [contacts]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = sold
      .map((l) => {
        const sale = saleByTitle.get(l.book.title);
        return {
          listing: l,
          buyer: sale?.contact_person_name,
          price: parseFloat(sale?.price_recorded ?? l.price),
          date: sale?.transaction_date ?? l.updated_at,
        };
      })
      .filter(
        (r) =>
          !q || r.listing.book.title.toLowerCase().includes(q) || r.buyer?.toLowerCase().includes(q)
      );
    return list.sort((a, b) => {
      if (sort === 'price_desc') return b.price - a.price;
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sort === 'date_asc' ? -diff : diff;
    });
  }, [sold, saleByTitle, query, sort]);

  const totalValue = rows.reduce((s, r) => s + r.price, 0);

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
    <>
      <ScreenHeader
        title="Sold Books"
        fallback="/profile"
        right={
          available.length > 0 && (
            <button
              onClick={() => setRecording(true)}
              aria-label="Record a sale"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white"
            >
              <IoAdd size={22} />
            </button>
          )
        }
      />
      <div className="space-y-4 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-12 flex-1 items-center gap-2 rounded-2xl bg-white px-4 shadow-card">
            <IoSearchOutline size={18} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or buyer..."
              aria-label="Search sold books"
              className="h-full flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              aria-label="Sort"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink bg-white text-ink"
            >
              <IoFilterOutline size={20} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-2xl bg-white py-1 shadow-float">
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      setSort(s.value);
                      setSortOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-2.5 text-left text-sm',
                      sort === s.value ? 'bg-secondary font-semibold text-primary' : 'text-text'
                    )}
                  >
                    {s.label} {sort === s.value && <IoCheckmark size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
              <IoCubeOutline size={20} />
            </span>
            <span>
              <span className="block text-[11px] text-muted">Total Sold</span>
              <span className="font-heading text-lg font-bold text-ink">{sold.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-app-yellow-light text-[#F59E0B]">
              <IoWalletOutline size={20} />
            </span>
            <span>
              <span className="block text-[11px] text-muted">Total Value</span>
              <span className="font-heading text-lg font-bold text-ink">
                {formatPrice(totalValue)}
              </span>
            </span>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-32" />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={IoBagHandleOutline}
            title={sold.length ? 'No matches' : 'No Sold Books Yet'}
            description="When you mark a listing as sold, it will show up here."
            action={
              available.length > 0 && (
                <Button size="md" onClick={() => setRecording(true)}>
                  <IoAdd size={18} /> Record a Sale
                </Button>
              )
            }
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {rows.map(({ listing: l, buyer, price, date }) => (
              <li key={l.id}>
                <Link
                  href={`/listings/${l.id}`}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-card"
                >
                  <span className="h-[100px] w-[70px] shrink-0 overflow-hidden rounded-lg bg-app-bg">
                    <BookCover src={listingCover(l)} alt={l.book.title} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-heading line-clamp-2 block text-[15px] font-semibold text-ink">
                      {l.book.title}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1 text-xs text-muted">
                      <IoPersonCircleOutline size={16} />{' '}
                      {buyer ? `Sold to ${buyer}` : 'Buyer not recorded'}
                    </span>
                    <span className="mt-3 flex">
                      <span className="pr-6">
                        <span className="block text-[10px] text-muted">Price</span>
                        <span className="font-heading text-base font-bold text-ink">
                          {formatPrice(price)}
                        </span>
                      </span>
                      <span className="border-l border-gray-heavy/60 pl-4">
                        <span className="block text-[10px] text-muted">Sold On</span>
                        <span className="text-sm text-text">{formatDate(date)}</span>
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={recording} onClose={() => setRecording(false)} title="Record a Sale">
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
            label="Buyer Name"
            value={form.buyer}
            onChange={(e) => setForm({ ...form, buyer: e.target.value })}
            required
          />
          <Input
            label="Final Price (₹)"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setRecording(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={logContact.isPending || updateStatus.isPending}
            >
              Save Sale
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
