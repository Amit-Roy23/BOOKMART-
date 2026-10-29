'use client';

import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Button, Card, StarInput, Stars, Textarea } from '@/components/ui/primitives';
import { useAddBookReview, useBookReviews } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';

export function ReviewsSection({ bookId, canReview }: { bookId: number; canReview: boolean }) {
  const toast = useToast();
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
    if (!rating) return toast.error('Pick a star rating.');
    if (!comment.trim()) return toast.error('Write a few words about the book.');
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
    <Card className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900">Ratings and reviews</h2>

      {total > 0 && (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="text-center sm:w-36">
            <p className="text-4xl font-extrabold text-slate-900">{average.toFixed(1)}</p>
            <Stars value={average} />
            <p className="mt-1 text-xs text-slate-500">
              {total} review{total > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-1 space-y-1.5">
            {distribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-slate-500">{star}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-slate-500">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading reviews…</p>
      ) : total === 0 ? (
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <MessageSquare className="h-4 w-4" /> No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {reviews.map((review) => (
            <li key={review.id} className="flex gap-3 py-4">
              <Avatar name={review.user} size={36} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{review.user}</p>
                  <Stars value={review.rating} size={12} />
                  <span className="text-xs text-slate-400">{formatDate(review.created_at)}</span>
                </div>
                {review.comment && <p className="mt-1 text-sm text-slate-600">{review.comment}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}

      {canReview && (
        <form onSubmit={submit} className="space-y-3 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-900">Write a review</p>
          <StarInput value={rating} onChange={setRating} />
          <Textarea
            aria-label="Your review"
            placeholder="What did you think of this book?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button type="submit" size="sm" loading={addReview.isPending}>
            Submit review
          </Button>
        </form>
      )}
    </Card>
  );
}
