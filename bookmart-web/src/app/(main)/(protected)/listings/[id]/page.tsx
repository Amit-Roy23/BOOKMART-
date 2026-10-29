'use client';

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  Pencil,
  Rocket,
  Share2,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FavoriteButton } from '@/components/listing/listing-card';
import { ReviewsSection } from '@/components/listing/reviews-section';
import {
  Avatar,
  BookCover,
  Button,
  Card,
  ConditionBadge,
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

const IMAGE_LABELS: Record<string, string> = {
  FRONT_COVER: 'Front cover',
  BACK_COVER: 'Back cover',
  SPINE: 'Spine',
  MIDDLE_PAGE: 'Middle page',
  DAMAGE_1: 'Damage',
  DAMAGE_2: 'Damage',
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { profile } = useAuth();
  const { data: listing, isLoading, isError } = useListing(id);
  const { data: rating } = useSellerRating(listing?.seller.id);
  const logContact = useLogContact();
  const updateStatus = useUpdateListingStatus();
  const deleteListing = useDeleteListing();
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) return <PageLoader />;
  if (isError || !listing) {
    return (
      <EmptyState
        icon={Eye}
        title="Listing not found"
        description="This book may have been removed by the seller."
        action={
          <Link href="/search">
            <Button>Browse books</Button>
          </Link>
        }
      />
    );
  }

  const isOwner = profile?.user_id === listing.seller.id;
  const images = listing.listing_images.filter((img) => img.image_url);
  const gallery = images.length
    ? images.map((img) => ({ src: img.image_url!, label: IMAGE_LABELS[img.label] }))
    : [{ src: listingCover(listing), label: 'Cover' }];
  const current = gallery[Math.min(activeImage, gallery.length - 1)];
  const { book } = listing;

  const contactSeller = () => {
    const phone = listing.seller.phone_number;
    if (!phone) return;
    const message = `Hi ${listing.seller.full_name}, I'm interested in buying your book: ${book.title} listed for ${formatPrice(listing.price)} on Bookmart.`;
    logContact.mutate({
      contact_person_name: listing.seller.full_name,
      book_title: book.title,
      deal_type: 'BOUGHT',
      price_recorded: listing.price,
    });
    window.open(whatsappLink(phone, message), '_blank', 'noopener,noreferrer');
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
      // User dismissed the share sheet.
    }
  };

  const toggleSold = () => {
    const status = listing.status === 'SOLD' ? 'AVAILABLE' : 'SOLD';
    updateStatus.mutate(
      { id: listing.id, status },
      {
        onSuccess: () =>
          toast.success(status === 'SOLD' ? 'Marked as sold' : 'Listing is available again'),
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
    ['Published', book.published_date ? formatDate(book.published_date) : ''],
    ['Language', book.language],
    ['ISBN-13', book.isbn_13],
    ['ISBN-10', book.isbn_10],
  ].filter(([, v]) => v);

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 sm:aspect-[4/3] lg:aspect-[4/5]">
            <BookCover
              src={current.src}
              alt={`${book.title} – ${current.label}`}
              className="object-contain"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white">
              {current.label}
            </span>
            {listing.status === 'SOLD' && (
              <span className="absolute left-3 top-3 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase text-white">
                Sold
              </span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {gallery.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show ${img.label}`}
                  className={cn(
                    'h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2',
                    i === activeImage ? 'border-brand-primary' : 'border-transparent opacity-70'
                  )}
                >
                  <BookCover src={img.src} alt={img.label} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">{book.title}</h1>
              <div className="flex gap-2">
                <button
                  onClick={share}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:border-brand-primary"
                  aria-label="Share listing"
                >
                  <Share2 className="h-4 w-4 text-slate-600" />
                </button>
                <FavoriteButton listing={listing} className="border border-slate-200" />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {book.authors.map((a) => (
                <Link
                  key={a.id}
                  href={`/authors/${a.id}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-brand-light hover:text-brand-dark"
                >
                  {a.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <ConditionBadge condition={listing.condition} />
            {book.language && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold uppercase">
                {book.language}
              </span>
            )}
            {listing.is_boosted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                <Rocket className="h-3 w-3" /> Featured
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {listing.views_count} views
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> {listing.favorite_count} saved
            </span>
          </div>

          <div className="rounded-2xl bg-brand-light/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark/70">
              Price
            </p>
            <p className="text-3xl font-extrabold text-brand-dark">{formatPrice(listing.price)}</p>
          </div>

          {isOwner ? (
            <Card className="space-y-3">
              <p className="text-sm font-bold text-slate-900">This is your listing</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/sell?edit=${listing.id}`}>
                  <Button variant="outline" className="w-full">
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                </Link>
                <Button variant="outline" onClick={toggleSold} loading={updateStatus.isPending}>
                  <CheckCircle2 className="h-4 w-4" />
                  {listing.status === 'SOLD' ? 'Mark available' : 'Mark as sold'}
                </Button>
                {!listing.is_boosted && listing.status === 'AVAILABLE' && (
                  <Link href={`/dashboard/boost?listing=${listing.id}`}>
                    <Button variant="secondary" className="w-full">
                      <Rocket className="h-4 w-4" /> Boost
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="text-rose-600 hover:bg-rose-50"
                  onClick={remove}
                  loading={deleteListing.isPending}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={contactSeller}
                disabled={!listing.seller.phone_number || listing.status === 'SOLD'}
              >
                <MessageCircle className="h-5 w-5" /> Contact seller on WhatsApp
              </Button>
              {!listing.seller.phone_number && (
                <p className="text-center text-xs text-slate-500">
                  This seller hasn’t added a phone number yet.
                </p>
              )}
            </div>
          )}

          <Card className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Listing &amp; seller info</h2>
            <Link
              href={`/sellers/${listing.seller.id}`}
              className="flex items-center gap-3 rounded-xl p-1 hover:bg-slate-50"
            >
              <Avatar
                src={listing.seller.profile_image}
                name={listing.seller.full_name}
                size={44}
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{listing.seller.full_name}</p>
                {rating && rating.rating_count > 0 ? (
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Stars value={rating.average_rating} size={12} />{' '}
                    {rating.average_rating.toFixed(1)} ({rating.rating_count})
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">View profile &amp; other books</p>
                )}
              </div>
            </Link>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Listed {formatDate(listing.created_at)}
              </span>
              {listing.distance_km != null && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {listing.distance_km.toFixed(1)} km away
                </span>
              )}
            </div>
            {!isOwner && (
              <Link
                href={`/report?listing=${listing.id}&title=${encodeURIComponent(book.title)}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600"
              >
                <Flag className="h-3.5 w-3.5" /> Report this listing
              </Link>
            )}
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          {listing.condition_notes && (
            <Card>
              <h2 className="mb-2 text-lg font-bold text-slate-900">Seller’s notes</h2>
              <p className="whitespace-pre-line text-sm text-slate-600">
                {listing.condition_notes}
              </p>
            </Card>
          )}
          {book.description && (
            <Card>
              <h2 className="mb-2 text-lg font-bold text-slate-900">About the book</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {book.description}
              </p>
            </Card>
          )}
          <ReviewsSection bookId={book.id} canReview={!isOwner} />
        </div>

        <div className="space-y-6">
          {specs.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-bold text-slate-900">Book specifications</h2>
              <dl className="divide-y divide-slate-100 text-sm">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="text-right font-medium text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}
          {(book.genres.length > 0 || listing.tags.length > 0) && (
            <Card className="space-y-4">
              {book.genres.length > 0 && (
                <div>
                  <h2 className="mb-2 text-sm font-bold text-slate-900">Genre</h2>
                  <div className="flex flex-wrap gap-2">
                    {book.genres.map((g) => (
                      <span
                        key={g}
                        className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {listing.tags.length > 0 && (
                <div>
                  <h2 className="mb-2 text-sm font-bold text-slate-900">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
