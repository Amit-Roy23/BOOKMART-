'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IoBookOutline } from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { BookCardSkeleton, MasonryBookCard } from '@/components/book/book-cards';
import { EmptyState, ErrorState } from '@/components/ui/primitives';
import { useCategoryBooks } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { findCategory } from '@/lib/categories';

/** Category screen — the app's GenreMasonryLayout: a two-column grid of books in the category. */
export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = findCategory(slug);
  const { data: books = [], isLoading, isError, error, refetch } = useCategoryBooks(category);

  if (!category) {
    return (
      <>
        <ScreenHeader title="Categories" fallback="/categories" />
        <EmptyState
          icon={IoBookOutline}
          title="Category not found"
          action={
            <Link href="/categories" className="font-heading font-bold text-primary">
              See all categories
            </Link>
          }
        />
      </>
    );
  }

  const Icon = category.icon;
  return (
    <div className="min-h-screen bg-white md:bg-app-bg">
      <ScreenHeader back fallback="/" className="bg-white/95 md:bg-app-bg/95" />
      <div className="px-6">
        <div className="flex items-center gap-3 pb-4">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl border"
            style={{ background: category.background, borderColor: category.border }}
          >
            <Icon size={22} color={category.iconColor} />
          </span>
          <div>
            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text">
              {category.label}
            </h1>
            <p className="text-[13px] font-medium text-muted">
              {isLoading
                ? 'Loading books…'
                : `${books.length} book${books.length === 1 ? '' : 's'} available`}
            </p>
          </div>
        </div>

        {isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <p className="mt-10 text-center font-medium text-muted">
            No books found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => (
              <MasonryBookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
