'use client';

import { ArrowLeft, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { CatalogGrid } from '@/components/catalog/catalog-book-card';
import { ListingGridSkeleton } from '@/components/listing/listing-card';
import { Avatar, EmptyState, ErrorState, PageLoader } from '@/components/ui/primitives';
import { useAuthor, useCatalogBooks } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';

export default function AuthorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: author, isLoading, isError, error } = useAuthor(id);
  // Same lookup as the app: catalog books matching the author's name.
  const books = useCatalogBooks({ search: author?.name }, !!author);
  const [expanded, setExpanded] = useState(false);

  if (isLoading) return <PageLoader />;
  if (isError || !author)
    return <ErrorState message={getErrorMessage(error, 'Author not found.')} />;

  const authored = (books.data ?? []).filter((b) =>
    b.authors.some((name) => name.toLowerCase() === author.name.toLowerCase())
  );
  const bio = author.bio?.trim();

  return (
    <div className="space-y-8">
      <Link
        href="/authors"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All authors
      </Link>

      <section className="flex flex-col items-center gap-6 rounded-3xl bg-white p-6 shadow-xs sm:flex-row sm:items-start md:p-8">
        <Avatar src={author.image_url} name={author.name} size={120} />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900">{author.name}</h1>
          <p className="text-sm text-slate-500">{author.designation || 'Author'}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm sm:justify-start">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {parseFloat(author.rating || '0').toFixed(1)} rating
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
              <BookOpen className="h-4 w-4" /> {authored.length} book
              {authored.length === 1 ? '' : 's'} on Bookmart
            </span>
          </div>
          {bio && (
            <div className="mt-4">
              <p
                className={`text-sm leading-relaxed text-slate-600 ${expanded ? '' : 'line-clamp-4'}`}
              >
                {bio}
              </p>
              {bio.length > 300 && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-1 text-sm font-semibold text-brand-primary hover:underline"
                >
                  {expanded ? 'Show less' : 'Read full biography'}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Books by {author.name}</h2>
        {books.isLoading ? (
          <ListingGridSkeleton count={5} />
        ) : authored.length === 0 ? (
          <EmptyState icon={BookOpen} title="No books available right now" />
        ) : (
          <CatalogGrid books={authored} />
        )}
      </section>
    </div>
  );
}
