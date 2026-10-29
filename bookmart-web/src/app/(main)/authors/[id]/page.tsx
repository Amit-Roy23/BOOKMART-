'use client';

/* eslint-disable @next/next/no-img-element -- author photos from external hosts */
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useBack } from '@/components/app/screen-header';
import { BookCover, PageLoader, Skeleton, Stars } from '@/components/ui/primitives';
import { useAuthor, useCatalogBooks } from '@/hooks/use-api';
import { formatPrice, initials } from '@/lib/utils';

/** The app's AuthorDetailsScreen: header, rating, About, and the author's books for sale. */
export default function AuthorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const goBack = useBack('/authors');
  const { data: author, isLoading, isError } = useAuthor(id);
  // Same lookup as the app: catalog books matching the author's name.
  const books = useCatalogBooks({ search: author?.name }, !!author);
  const [expanded, setExpanded] = useState(false);

  if (isLoading) return <PageLoader />;
  if (isError || !author) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted">Author not found.</p>
        <button onClick={goBack} className="font-heading font-semibold text-primary">
          Go Back
        </button>
      </div>
    );
  }

  const authored = (books.data ?? []).filter(
    (b) =>
      b.cheapest_listing && b.authors.some((n) => n.toLowerCase() === author.name.toLowerCase())
  );
  const rating = parseFloat(author.rating) || 0;
  const bio = author.bio?.trim();

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <header className="px-6 pt-5">
        <button onClick={goBack} aria-label="Go back" className="text-ink">
          <IoArrowBack size={26} />
        </button>
      </header>

      <section className="flex flex-col items-center px-6 pt-4 text-center">
        {author.image_url ? (
          <img
            src={author.image_url}
            alt={author.name}
            className="h-32 w-32 rounded-3xl object-cover shadow-card"
          />
        ) : (
          <span className="font-heading flex h-32 w-32 items-center justify-center rounded-3xl bg-secondary text-4xl font-bold text-primary">
            {initials(author.name)}
          </span>
        )}
        <p className="mt-4 text-sm text-muted">{author.designation || 'Author'}</p>
        <h1 className="text-2xl font-bold text-ink">{author.name}</h1>
        <div className="mt-2 flex items-center gap-1.5">
          <Stars value={rating} size={16} />
          <span className="text-sm text-muted">({rating.toFixed(1)})</span>
        </div>
      </section>

      {bio && (
        <section className="mt-6 px-6">
          <h2 className="mb-2 text-lg font-bold text-ink">About</h2>
          <p className={`text-sm leading-relaxed text-text ${expanded ? '' : 'line-clamp-5'}`}>
            {bio}
          </p>
          {bio.length > 300 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="font-heading mt-1 text-sm font-semibold text-primary"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-3 px-6 text-lg font-bold text-ink">Books</h2>
        {books.isLoading ? (
          <div className="flex gap-4 px-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-36 shrink-0" />
            ))}
          </div>
        ) : authored.length === 0 ? (
          <p className="px-6 text-sm text-muted">No books available right now.</p>
        ) : (
          <div className="scrollbar-hide flex gap-4 overflow-x-auto px-6 pb-2">
            {authored.map((b) => (
              <Link
                key={b.id}
                href={`/listings/${b.cheapest_listing!.id}`}
                className="w-36 shrink-0"
              >
                <div className="h-52 overflow-hidden rounded-2xl bg-white shadow-card">
                  <BookCover
                    src={b.cover_url || b.cheapest_listing!.cover_image_url}
                    alt={b.title}
                  />
                </div>
                <p className="font-heading mt-2 truncate text-sm font-bold text-ink">{b.title}</p>
                <p className="font-heading text-sm font-bold text-primary">
                  {formatPrice(b.cheapest_listing!.price)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
