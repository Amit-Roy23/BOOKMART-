import Link from 'next/link';
import { BookCover, ConditionBadge } from '@/components/ui/primitives';
import { formatPrice } from '@/lib/utils';
import type { CatalogBook } from '@/types/api';

/** A catalog book with its cheapest available copy, linking to that listing. */
export function CatalogBookCard({ book }: { book: CatalogBook }) {
  const cheapest = book.cheapest_listing;
  const cover = book.cover_url || cheapest?.cover_image_url;
  const content = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <BookCover
          src={cover}
          alt={book.title}
          className="transition duration-300 group-hover:scale-105"
        />
        {book.total_listings_count > 1 && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-slate-700">
            {book.total_listings_count} copies
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{book.title}</h3>
        <p className="line-clamp-1 text-xs text-slate-500">
          {book.authors.join(', ') || 'Unknown Author'}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {cheapest ? (
            <>
              <span className="text-sm font-extrabold text-brand-dark">
                <span className="mr-1 text-[10px] font-medium text-slate-400">from</span>
                {formatPrice(cheapest.price)}
              </span>
              <ConditionBadge condition={cheapest.condition} />
            </>
          ) : (
            <span className="text-xs font-medium text-slate-400">No copies for sale</span>
          )}
        </div>
      </div>
    </>
  );

  const className =
    'group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md';
  return cheapest ? (
    <Link href={`/listings/${cheapest.id}`} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

export function CatalogGrid({ books }: { books: CatalogBook[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book) => (
        <CatalogBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
