'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  IoBookOutline,
  IoChatbubbleEllipsesOutline,
  IoEllipsisVertical,
  IoFlagOutline,
  IoCalendarOutline,
  IoShareSocialOutline,
  IoShieldCheckmark,
  IoStar,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { MasonryBookCard, toBookView } from '@/components/book/book-cards';
import {
  Avatar,
  Button,
  Chip,
  EmptyState,
  Select,
  Skeleton,
  StarInput,
  Stars,
} from '@/components/ui/primitives';
import {
  useAddSellerReview,
  useSellerListings,
  useSellerRating,
  useSellerReviews,
} from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { formatDate, whatsappLink } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

/** The app's PublicProfileScreen for a seller, plus their books and seller reviews. */
export default function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const sellerId = Number(id);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const { profile, status } = useAuth();
  const { data: listings = [], isLoading } = useSellerListings(sellerId);
  const { data: rating } = useSellerRating(sellerId);
  const { data: reviews = [] } = useSellerReviews(sellerId);
  const addReview = useAddSellerReview(sellerId);
  const [tab, setTab] = useState<'AVAILABLE' | 'SOLD'>('AVAILABLE');
  const [form, setForm] = useState({ listing: '', rating: 0, review: '' });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const seller = listings[0]?.seller ?? reviews[0]?.seller;
  const phone = listings[0]?.seller.phone_number;
  const isMe = profile?.user_id === sellerId;
  const available = listings.filter((l) => l.status === 'AVAILABLE');
  const sold = listings.filter((l) => l.status === 'SOLD');
  const reviewedIds = new Set(
    reviews.filter((r) => r.reviewer.id === profile?.user_id).map((r) => r.listing)
  );
  const reviewable = listings.filter((l) => !reviewedIds.has(l.id));

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share)
        await navigator.share({ title: `${seller?.full_name} on Bookmart`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success('Profile link copied');
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  const contact = () => {
    if (status !== 'authenticated')
      return router.push(`/login?next=${encodeURIComponent(pathname)}`);
    if (!phone) return toast.info("This seller hasn't added a phone number yet.");
    window.open(
      whatsappLink(phone, `Hi ${seller?.full_name}, I found your books on Bookmart.`),
      '_blank',
      'noopener,noreferrer'
    );
  };

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
      <>
        <ScreenHeader title="Profile" />
        <EmptyState
          icon={IoBookOutline}
          title="Seller not found"
          description="This seller has no listings yet."
        />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <ScreenHeader
        title="Profile"
        right={
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="More options"
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink text-ink"
            >
              <IoEllipsisVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-2xl bg-white py-1 shadow-float">
                <button
                  onClick={share}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text hover:bg-app-bg"
                >
                  <IoShareSocialOutline size={18} /> Share Profile
                </button>
                {!isMe && status === 'authenticated' && (
                  <Link
                    href={`/report?user=${sellerId}&name=${encodeURIComponent(seller?.full_name ?? '')}`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-app-red hover:bg-app-red-light"
                  >
                    <IoFlagOutline size={18} /> Report User
                  </Link>
                )}
              </div>
            )}
          </div>
        }
      />

      <div className="space-y-5 px-6">
        <section className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-20 w-20 rounded-full" />
          ) : (
            <Avatar
              src={seller?.profile_image}
              name={seller?.full_name}
              size={80}
              className="bg-gray-heavy/50 text-ink"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-heading truncate text-xl font-bold text-ink">
              {seller?.full_name ?? '…'}
            </p>
            {listings[0] && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                <IoCalendarOutline size={13} /> Seller since{' '}
                {formatDate(listings[listings.length - 1].created_at, { day: undefined })}
              </p>
            )}
          </div>
          <span className="flex flex-col items-center rounded-xl border border-gray-heavy/70 px-3 py-2 text-center">
            <IoShieldCheckmark size={18} className="text-primary" />
            <span className="font-heading text-[10px] font-bold leading-tight text-primary">
              Trusted
              <br />
              Seller
            </span>
          </span>
        </section>

        <section className="grid grid-cols-3 divide-x divide-gray-heavy/60 rounded-2xl border border-gray-heavy/60 bg-white py-4 text-center">
          {[
            {
              label: 'Rating',
              sub: `${rating?.rating_count ?? 0} reviews`,
              value: rating?.rating_count ? rating.average_rating.toFixed(1) : '–',
            },
            { label: 'Active Listings', sub: 'Books for sale', value: available.length },
            { label: 'Books Sold', sub: 'Successfully', value: sold.length },
          ].map((s) => (
            <div key={s.label} className="px-1">
              <p className="font-heading text-lg font-bold text-primary">{s.value}</p>
              <p className="text-xs font-semibold text-ink">{s.label}</p>
              <p className="text-[10px] text-muted">{s.sub}</p>
            </div>
          ))}
        </section>

        {!isMe ? (
          <div className="grid grid-cols-2 gap-3">
            <Button size="md" onClick={contact}>
              <IoChatbubbleEllipsesOutline size={18} /> Contact
            </Button>
            <Button
              size="md"
              variant="outline"
              className="border-primary text-primary"
              onClick={share}
            >
              <IoShareSocialOutline size={18} /> Share Profile
            </Button>
          </div>
        ) : (
          <Link href="/profile">
            <Button size="md" variant="outline" className="w-full border-primary text-primary">
              This is your public profile · Go to My Profile
            </Button>
          </Link>
        )}

        <section className="rounded-2xl border border-gray-heavy/60 bg-white p-4">
          <h2 className="font-heading mb-3 flex items-center gap-2 text-sm font-bold text-primary">
            <IoStar size={18} /> Ratings &amp; Reviews
          </h2>
          {rating && rating.rating_count > 0 ? (
            <div className="flex items-start gap-5">
              <div className="w-24 text-center">
                <p className="font-heading text-3xl font-bold text-primary">
                  {rating.average_rating.toFixed(1)}
                </p>
                <Stars value={rating.average_rating} size={14} />
                <p className="mt-1 text-[10px] text-muted">({rating.rating_count} reviews)</p>
              </div>
              <ul className="min-w-0 flex-1 space-y-1.5">
                {reviews.slice(0, 3).map((r) => (
                  <li key={r.id} className="truncate text-xs italic text-muted">
                    &ldquo;{r.review || `${r.rating} stars`}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted">No ratings yet.</p>
          )}
        </section>

        <section>
          <div className="mb-3 flex gap-2">
            <Chip active={tab === 'AVAILABLE'} onClick={() => setTab('AVAILABLE')}>
              For Sale ({available.length})
            </Chip>
            <Chip active={tab === 'SOLD'} onClick={() => setTab('SOLD')}>
              Sold ({sold.length})
            </Chip>
          </div>
          {(tab === 'AVAILABLE' ? available : sold).length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              {tab === 'AVAILABLE' ? 'No books for sale.' : 'No sold books yet.'}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {(tab === 'AVAILABLE' ? available : sold).map((l) => (
                <MasonryBookCard key={l.id} book={toBookView(l)} />
              ))}
            </div>
          )}
        </section>

        {reviews.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-ink">All Reviews</h2>
            {reviews.map((r) => (
              <div key={r.id} className="flex gap-3 rounded-2xl bg-white p-4 shadow-card">
                <Avatar src={r.reviewer.profile_image} name={r.reviewer.full_name} size={36} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-sm font-semibold text-ink">
                      {r.reviewer.full_name}
                    </p>
                    <Stars value={r.rating} size={12} />
                  </div>
                  {r.review && <p className="mt-1 text-sm text-text">{r.review}</p>}
                  <p className="mt-1 text-[11px] text-muted">{formatDate(r.created_at)}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {!isMe && status === 'authenticated' && reviewable.length > 0 && (
          <form onSubmit={submitReview} className="space-y-4 rounded-2xl bg-white p-5 shadow-card">
            <h2 className="text-base font-bold text-ink">Rate this Seller</h2>
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
            <StarInput value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            <textarea
              aria-label="Review"
              placeholder="How was your experience with this seller?"
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              className="min-h-[90px] w-full rounded-2xl border border-gray-heavy px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
            <Button className="w-full" loading={addReview.isPending}>
              Submit Rating
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
