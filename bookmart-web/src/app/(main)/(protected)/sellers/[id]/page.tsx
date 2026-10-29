'use client';

import { BookOpen, Flag, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ListingGrid, ListingGridSkeleton } from '@/components/listing/listing-card';
import {
  Avatar,
  Button,
  Card,
  Chip,
  EmptyState,
  Select,
  StarInput,
  Stars,
  Textarea,
} from '@/components/ui/primitives';
import {
  useAddSellerReview,
  useSellerListings,
  useSellerRating,
  useSellerReviews,
} from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

export default function SellerPage() {
  const { id } = useParams<{ id: string }>();
  const sellerId = Number(id);
  const toast = useToast();
  const { profile } = useAuth();
  const { data: listings = [], isLoading } = useSellerListings(sellerId);
  const { data: rating } = useSellerRating(sellerId);
  const { data: reviews = [] } = useSellerReviews(sellerId);
  const addReview = useAddSellerReview(sellerId);
  const [tab, setTab] = useState<'AVAILABLE' | 'SOLD'>('AVAILABLE');
  const [form, setForm] = useState({ listing: '', rating: 0, review: '' });

  const seller = listings[0]?.seller ?? reviews[0]?.seller;
  const isMe = profile?.user_id === sellerId;
  const available = listings.filter((l) => l.status === 'AVAILABLE');
  const sold = listings.filter((l) => l.status === 'SOLD');
  const reviewedListingIds = new Set(
    reviews.filter((r) => r.reviewer.id === profile?.user_id).map((r) => r.listing)
  );
  const reviewable = listings.filter((l) => !reviewedListingIds.has(l.id));

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.listing) return toast.error('Choose which book you bought.');
    if (!form.rating) return toast.error('Pick a star rating.');
    addReview.mutate(
      { listing: Number(form.listing), rating: form.rating, review: form.review.trim() },
      {
        onSuccess: () => {
          toast.success('Thanks for rating this seller!');
          setForm({ listing: '', rating: 0, review: '' });
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  if (!isLoading && !seller) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Seller not found"
        description="This seller has no listings yet."
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-xs sm:flex-row sm:items-center md:p-8">
        <Avatar src={seller?.profile_image} name={seller?.full_name} size={96} />
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {seller?.full_name ?? 'Loading…'}
          </h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {rating && rating.rating_count > 0
                ? `${rating.average_rating.toFixed(1)} · ${rating.rating_count} rating${rating.rating_count > 1 ? 's' : ''}`
                : 'No ratings yet'}
            </span>
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {available.length} active · {sold.length} sold
            </span>
          </div>
        </div>
        {isMe ? (
          <Link href="/profile">
            <Button variant="outline">Go to my profile</Button>
          </Link>
        ) : (
          <Link
            href={`/report?user=${sellerId}&name=${encodeURIComponent(seller?.full_name ?? '')}`}
          >
            <Button variant="ghost" className="text-slate-500 hover:text-rose-600">
              <Flag className="h-4 w-4" /> Report user
            </Button>
          </Link>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex gap-2">
          <Chip active={tab === 'AVAILABLE'} onClick={() => setTab('AVAILABLE')}>
            For sale ({available.length})
          </Chip>
          <Chip active={tab === 'SOLD'} onClick={() => setTab('SOLD')}>
            Sold ({sold.length})
          </Chip>
        </div>
        {isLoading ? (
          <ListingGridSkeleton count={5} />
        ) : (tab === 'AVAILABLE' ? available : sold).length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={tab === 'AVAILABLE' ? 'No books for sale' : 'No sold books yet'}
          />
        ) : (
          <ListingGrid listings={tab === 'AVAILABLE' ? available : sold} />
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-900">Seller reviews</h2>
          {rating && rating.rating_count > 0 && (
            <div className="mb-4 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = rating.rating_distribution[String(star)] ?? 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-slate-500">{star}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${(count / rating.rating_count) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-slate-500">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
          {reviews.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <MessageSquare className="h-4 w-4" /> No reviews yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {reviews.map((r) => (
                <li key={r.id} className="flex gap-3 py-4">
                  <Avatar src={r.reviewer.profile_image} name={r.reviewer.full_name} size={36} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{r.reviewer.full_name}</p>
                      <Stars value={r.rating} size={12} />
                      <span className="text-xs text-slate-400">{formatDate(r.created_at)}</span>
                    </div>
                    {r.review && <p className="mt-1 text-sm text-slate-600">{r.review}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {!isMe && reviewable.length > 0 && (
          <Card className="self-start">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Rate this seller</h2>
            <form onSubmit={submitReview} className="space-y-4">
              <Select
                label="Book you bought"
                value={form.listing}
                onChange={(e) => setForm({ ...form, listing: e.target.value })}
              >
                <option value="">Select a book</option>
                {reviewable.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.book.title}
                  </option>
                ))}
              </Select>
              <StarInput value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
              <Textarea
                aria-label="Review"
                placeholder="How was your experience with this seller?"
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
              />
              <Button type="submit" className="w-full" loading={addReview.isPending}>
                Submit rating
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
