'use client';

import { BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CatalogGrid } from '@/components/catalog/catalog-book-card';
import { ListingGridSkeleton } from '@/components/listing/listing-card';
import { Button, Chip, EmptyState, ErrorState } from '@/components/ui/primitives';
import { useGenre } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';

type Sort = 'available' | 'price' | '-price' | 'title';

export default function GenrePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: genre, isLoading, isError, error, refetch } = useGenre(slug);
  const [sort, setSort] = useState<Sort>('available');
  const [inStockOnly, setInStockOnly] = useState(true);

  const books = useMemo(() => {
    let list = genre?.books ?? [];
    if (inStockOnly) list = list.filter((b) => b.total_listings_count > 0);
    const price = (p: string | null) => (p == null ? Infinity : parseFloat(p));
    return [...list].sort((a, b) => {
      if (sort === 'price') return price(a.lowest_price) - price(b.lowest_price);
      if (sort === '-price') return price(b.lowest_price) - price(a.lowest_price);
      if (sort === 'title') return a.title.localeCompare(b.title);
      return b.total_listings_count - a.total_listings_count;
    });
  }, [genre, sort, inStockOnly]);

  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/categories" className="hover:text-brand-primary">
          Categories
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-700">{genre?.name ?? '…'}</span>
      </nav>

      <section className="rounded-3xl bg-gradient-to-br from-brand-primary to-brand-dark px-6 py-8 text-white md:px-10">
        <span className="text-3xl">{genre?.icon}</span>
        <h1 className="mt-2 text-3xl font-extrabold">{genre?.name ?? 'Loading…'}</h1>
        {genre?.subtitle && <p className="mt-1 text-white/80">{genre.subtitle}</p>}
        {genre && (
          <p className="mt-3 text-sm text-white/80">
            {genre.total_books_count} book{genre.total_books_count === 1 ? '' : 's'} · cheapest
            copies first
          </p>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <Chip active={sort === 'available'} onClick={() => setSort('available')}>
          Most copies
        </Chip>
        <Chip active={sort === 'price'} onClick={() => setSort('price')}>
          Price: low to high
        </Chip>
        <Chip active={sort === '-price'} onClick={() => setSort('-price')}>
          Price: high to low
        </Chip>
        <Chip active={sort === 'title'} onClick={() => setSort('title')}>
          Title A–Z
        </Chip>
        <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 accent-brand-primary"
          />
          Only books for sale
        </label>
      </div>

      {isLoading ? (
        <ListingGridSkeleton />
      ) : books.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No books here yet"
          description="Be the first to list a book in this genre."
          action={
            <Link href="/sell">
              <Button>Sell a book</Button>
            </Link>
          }
        />
      ) : (
        <CatalogGrid books={books} />
      )}
    </div>
  );
}
