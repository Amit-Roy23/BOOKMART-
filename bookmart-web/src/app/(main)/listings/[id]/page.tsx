'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  IoArrowBack,
  IoCalendarOutline,
  IoChatbubbleEllipsesOutline,
  IoCheckmarkCircleOutline,
  IoCreateOutline,
  IoFlagOutline,
  IoLocationOutline,
  IoLogoWhatsapp,
  IoPersonCircleOutline,
  IoRocketOutline,
  IoShareSocialOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useBack } from '@/components/app/screen-header';
import { HeartButton } from '@/components/book/heart-button';
import { ReviewsSection } from '@/components/listing/reviews-section';
import {
  Avatar,
  BookCover,
  Button,
  EmptyState,
  PageLoader,
  Stars,
} from '@/components/ui/primitives';
import {
  useDeleteListing,
  useListing,
  useLogContact,
  useSellerRating,
  useUpdateListingStatus,
} from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, formatDate, formatPrice, listingCover, whatsappLink } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

// Layout follows the app's BookDetailsScreen.

const CONDITION_CHIP: Record<string, string> = {
  NEW: 'text-app-green border-app-green/30 bg-app-green-light',
  LIKE_NEW: 'text-primary border-primary/20 bg-secondary',
  GOOD: 'text-app-blue border-app-blue/20 bg-app-blue-light',
  FAIR: 'text-[#c49a00] border-app-yellow/40 bg-app-yellow-light',
  POOR: 'text-app-red border-app-red/30 bg-app-red-light',
};

function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % images.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    }, 4000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={(e) =>
          setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
        }
        className="scrollbar-hide flex h-[40vh] min-h-[280px] snap-x snap-mandatory overflow-x-auto bg-white md:h-[520px] md:rounded-3xl"
      >
        {images.map((src, i) => (
          <div key={src + i} className="h-full w-full shrink-0 snap-center">
            <BookCover src={src} alt={`${title} photo ${i + 1}`} className="object-cover" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden>
          {images.map((src, i) => (
            <span
              key={src + i}
              className={cn(
                'h-1 rounded-full transition-all',
                i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-[15px] font-bold text-ink">{children}</h2>;
}

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const goBack = useBack('/');
  const toast = useToast();
  const { profile, status } = useAuth();
  const { data: listing, isLoading, isError } = useListing(id);
  const { data: rating } = useSellerRating(listing?.seller.id);
  const logContact = useLogContact();
  const updateStatus = useUpdateListingStatus();
  const deleteListing = useDeleteListing();

  if (isLoading) return <PageLoader />;
  if (isError || !listing) {
    return (
      <EmptyState
        icon={IoChatbubbleEllipsesOutline}
        title="Book not found."
        description="This book may have been removed by the seller."
        action={
          <button onClick={goBack} className="font-heading font-semibold text-primary">
            Go Back
          </button>
        }
      />
    );
  }

  const { book, seller } = listing;
  const isOwner = profile?.user_id === seller.id;
  const images = listing.listing_images.map((img) => img.image_url).filter(Boolean) as string[];
  const gallery = images.length ? images : [listingCover(listing)];

  const contactSeller = () => {
    if (status !== 'authenticated') {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!seller.phone_number) return;
    logContact.mutate({
      contact_person_name: seller.full_name,
      book_title: book.title,
      deal_type: 'BOUGHT',
      price_recorded: listing.price,
    });
    const message = `Hi ${seller.full_name}, I'm interested in buying your book: ${book.title} listed for ${formatPrice(listing.price)}.`;
    window.open(whatsappLink(seller.phone_number, message), '_blank', 'noopener,noreferrer');
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: book.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  const toggleSold = () => {
    const next = listing.status === 'SOLD' ? 'AVAILABLE' : 'SOLD';
    updateStatus.mutate(
      { id: listing.id, status: next },
      {
        onSuccess: () =>
          toast.success(next === 'SOLD' ? 'Marked as sold' : 'Listing is available again'),
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  const remove = () => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    deleteListing.mutate(listing.id, {
      onSuccess: () => {
        toast.success('Listing deleted');
        router.replace('/dashboard/listings');
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const specs = [
    ['Publisher', book.publisher],
    ['Published Date', book.published_date ? formatDate(book.published_date) : ''],
    ['Language', book.language],
    ['ISBN-13', book.isbn_13],
    ['ISBN-10', book.isbn_10],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="pb-28 md:px-6 md:pt-6">
      <div className="md:grid md:grid-cols-[1fr_1.1fr] md:gap-8">
        <div className="relative md:sticky md:top-6 md:self-start">
          <button
            onClick={goBack}
            aria-label="Go back"
            className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-md"
          >
            <IoArrowBack size={22} />
          </button>
          <button
            onClick={share}
            aria-label="Share"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-md"
          >
            <IoShareSocialOutline size={20} />
          </button>
          <Gallery images={gallery} title={book.title} />
        </div>

        <div className="space-y-5 px-6 pt-5 md:px-0 md:pt-0">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-[22px] font-bold leading-tight text-ink">{book.title}</h1>
              <HeartButton listingId={listing.id} sellerId={seller.id} size={26} className="mt-1" />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {book.authors.map((a) => (
                <Link
                  key={a.id}
                  href={`/authors/${a.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-secondary py-1 pl-1 pr-3 text-xs font-semibold text-primary"
                >
                  <span className="h-5 w-5 rounded-full bg-white" />
                  {a.name}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-bold',
                  CONDITION_CHIP[listing.condition] ?? 'bg-white text-text'
                )}
              >
                {listing.condition}
              </span>
              {book.language && (
                <span className="rounded-full border border-gray-heavy/60 bg-white px-3 py-1 text-xs font-bold text-ink">
                  {book.language.toUpperCase()}
                </span>
              )}
              {listing.distance_km != null && (
                <span className="inline-flex items-center gap-1 rounded-full border border-gray-heavy/60 bg-white px-3 py-1 text-xs font-bold text-ink">
                  <IoLocationOutline size={12} /> {listing.distance_km.toFixed(1)} km away
                </span>
              )}
              {listing.status === 'SOLD' && (
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">
                  SOLD
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-card">
            <span className="text-sm text-muted">Price</span>
            <span className="font-heading text-[22px] font-bold text-primary">
              {formatPrice(listing.price)}
            </span>
          </div>

          {listing.condition_notes && (
            <div>
              <SectionLabel>Seller&apos;s Notes</SectionLabel>
              <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 shadow-card">
                <IoChatbubbleEllipsesOutline size={18} className="mt-0.5 shrink-0 text-primary" />
                <p className="whitespace-pre-line text-sm text-text">{listing.condition_notes}</p>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white px-4 py-4 shadow-card">
            <p className="font-heading mb-3 text-sm font-bold text-ink">
              Listing &amp; Seller Info
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/sellers/${seller.id}`} className="flex items-center gap-2">
                {seller.profile_image ? (
                  <Avatar src={seller.profile_image} name={seller.full_name} size={22} />
                ) : (
                  <IoPersonCircleOutline size={22} className="shrink-0 text-primary" />
                )}
                <span className="min-w-0">
                  <span className="block text-[10px] text-muted">Seller</span>
                  <span className="block truncate text-sm font-semibold text-ink">
                    {seller.full_name}
                  </span>
                  {rating && rating.rating_count > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-muted">
                      <Stars value={rating.average_rating} size={10} /> ({rating.rating_count})
                    </span>
                  )}
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <IoCalendarOutline size={22} className="shrink-0 text-primary" />
                <span>
                  <span className="block text-[10px] text-muted">Listed On</span>
                  <span className="block text-sm font-semibold text-ink">
                    {formatDate(listing.created_at)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {book.description && (
            <div>
              <SectionLabel>About the Book</SectionLabel>
              <p className="whitespace-pre-line text-sm leading-relaxed text-text">
                {book.description}
              </p>
            </div>
          )}

          {specs.length > 0 && (
            <div>
              <SectionLabel>Book Specifications</SectionLabel>
              <dl className="divide-y divide-gray-light rounded-2xl bg-white px-4 shadow-card">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-3.5 text-sm">
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-right font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {book.genres.length > 0 && (
            <div>
              <SectionLabel>Category</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {book.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-primary/15 bg-secondary px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {listing.tags.length > 0 && (
            <div>
              <SectionLabel>Tags</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-muted shadow-card"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ReviewsSection bookId={book.id} canReview={!isOwner} />

          {!isOwner && status === 'authenticated' && (
            <Link
              href={`/report?listing=${listing.id}&title=${encodeURIComponent(book.title)}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-app-red"
            >
              <IoFlagOutline size={14} /> Report this listing
            </Link>
          )}
        </div>
      </div>

      {/* Bottom action bar, like the app's back + “Contact Seller” footer. */}
      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
        <div className="mx-auto flex max-w-[1052px] items-center gap-3 rounded-3xl bg-white p-3 shadow-float">
          <button
            onClick={goBack}
            aria-label="Go back"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-heavy text-ink"
          >
            <IoArrowBack size={20} />
          </button>
          {isOwner ? (
            <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
              <Link href={`/sell?edit=${listing.id}`}>
                <Button size="md" variant="secondary" className="w-full">
                  <IoCreateOutline size={18} /> Edit
                </Button>
              </Link>
              <Button
                size="md"
                variant="secondary"
                onClick={toggleSold}
                loading={updateStatus.isPending}
              >
                <IoCheckmarkCircleOutline size={18} />
                {listing.status === 'SOLD' ? 'Available' : 'Sold'}
              </Button>
              {!listing.is_boosted && listing.status === 'AVAILABLE' ? (
                <Link href={`/dashboard/boost?listing=${listing.id}`}>
                  <Button size="md" className="w-full">
                    <IoRocketOutline size={18} /> Boost
                  </Button>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              <Button
                size="md"
                variant="ghost"
                className="text-app-red"
                onClick={remove}
                loading={deleteListing.isPending}
              >
                <IoTrashOutline size={18} /> Delete
              </Button>
            </div>
          ) : (
            <div className="flex-1">
              <Button
                className="h-12 w-full"
                onClick={contactSeller}
                disabled={
                  (status === 'authenticated' && !seller.phone_number) || listing.status === 'SOLD'
                }
              >
                <IoLogoWhatsapp size={20} /> Contact Seller
              </Button>
              {status === 'authenticated' && !seller.phone_number && (
                <p className="mt-1 text-center text-[11px] text-muted">
                  Seller hasn&apos;t added a phone number yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
