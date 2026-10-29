'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button, StarInput, Stars } from '@/components/ui/primitives';
import { useAddBookReview, useBookReviews } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

/** “Ratings and reviews” block from the app's BookDetailsScreen. */
export function ReviewsSection({ bookId, canReview }: { bookId: number; canReview: boolean }) {
  const toast = useToast();
  const pathname = usePathname();
  const { status } = useAuth();
  const { data: reviews = [], isLoading } = useBookReviews(bookId);
  const addReview = useAddBookReview(bookId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const total = reviews.length;
  const average = total ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview.mutate(
      { rating, comment: comment.trim() },
      {
        onSuccess: () => {
          toast.success('Thanks for your review!');
          setRating(0);
          setComment('');
        },
        onError: (err) => toast.error(getErrorMessage(err, 'Failed to submit review.')),
      }
    );
  };

  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-bold text-ink">Ratings and reviews</h2>

      {total > 0 && (
        <div className="flex items-center gap-6 rounded-2xl bg-white px-5 py-5 shadow-card">
          <div className="w-28 text-center">
            <p className="font-heading text-4xl font-bold text-ink">{Number(average.toFixed(1))}</p>
            <div className="mt-1">
              <Stars value={average} size={18} />
            </div>
            <p className="mt-1 text-xs text-muted">
              {total} review{total > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-1 space-y-1.5">
            {distribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 font-semibold text-ink">{star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-light">
                  <div
                    className="h-full rounded-full bg-app-yellow"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted">Loading reviews…</p>
      ) : total === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-5 text-center text-sm text-muted shadow-card">
          No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-2xl bg-white px-4 py-4 shadow-card">
              <div className="flex items-center justify-between">
                <p className="font-heading text-sm font-semibold text-ink">{review.user}</p>
                <span className="text-xs text-muted">
                  {formatDate(review.created_at, { year: undefined })}
                </span>
              </div>
              <div className="mt-1">
                <Stars value={review.rating} size={15} />
              </div>
              {review.comment && <p className="mt-2 text-sm text-text">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}

      {canReview &&
        (status === 'authenticated' ? (
          <form onSubmit={submit} className="space-y-3 border-t border-gray-light pt-4">
            <h3 className="text-[15px] font-bold text-ink">Write a Review</h3>
            <StarInput value={rating} onChange={setRating} />
            <textarea
              aria-label="Your review"
              placeholder="What did you think of this book?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] w-full rounded-2xl border border-gray-light bg-white px-4 py-3 text-sm shadow-card focus:border-primary focus:outline-none"
            />
            <Button
              type="submit"
              className="h-12 w-full"
              disabled={!rating || !comment.trim()}
              loading={addReview.isPending}
            >
              Submit Review
            </Button>
          </form>
        ) : (
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="font-heading block text-center text-sm font-semibold text-primary"
          >
            Sign in to write a review
          </Link>
        ))}
    </section>
  );
}
