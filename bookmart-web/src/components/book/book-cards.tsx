'use client';

import Link from 'next/link';
import {
  IoAdd,
  IoBook,
  IoFlame,
  IoHourglass,
  IoLocationSharp,
  IoSparkles,
  IoTime,
} from 'react-icons/io5';
import { HeartButton } from '@/components/book/heart-button';
import { BookCover } from '@/components/ui/primitives';
import type { BookView } from '@/lib/book-view';
import { cn } from '@/lib/utils';

export { type BookView, toBookView } from '@/lib/book-view';

// Card designs follow bookmart-app/src/components (NearestBooks, smallComp/*).

const price = (n: number) => `₹${Number.isInteger(n) ? n : n.toFixed(2)}`;
const href = (b: BookView) => `/listings/${b.id}`;

export function SectionHeader({
  title,
  seeAllHref,
  linkLabel = 'SEE ALL',
  icon,
  badge,
  className,
  titleClassName,
}: {
  title: string;
  seeAllHref?: string;
  linkLabel?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn('mb-2 flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className={cn('text-[15px] font-bold text-text md:text-lg', titleClassName)}>
          {title}
        </h2>
        {badge}
      </div>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className="font-heading text-xs font-bold tracking-wide text-primary hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

const cardBase =
  'group overflow-hidden rounded-xl border border-[rgba(0,128,128,0.05)] bg-white shadow-card transition hover:-translate-y-0.5';

function CardInfo({
  book,
  priceClass = 'text-primary',
  heart = false,
}: {
  book: BookView;
  priceClass?: string;
  heart?: boolean;
}) {
  return (
    <div className="p-1.5 md:p-2.5">
      <p className="truncate text-[11px] font-bold text-text md:text-sm">{book.title}</p>
      <p className="mt-0.5 truncate text-[9px] font-medium text-muted md:text-xs">{book.author}</p>
      <div className="mt-1 flex items-center justify-between">
        <span className={cn('font-heading text-xs font-bold md:text-sm', priceClass)}>
          {price(book.price)}
        </span>
        {heart && <HeartButton listingId={book.id} sellerId={book.sellerId} />}
      </div>
    </div>
  );
}

const grid3 = 'grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6';

// ── Nearest Books (3-column grid with distance badge) ──

export function NearestBooksSection({
  books,
  seeAllHref,
}: {
  books: BookView[];
  seeAllHref?: string;
}) {
  if (!books.length) return null;
  return (
    <section className="mt-5 px-6">
      <SectionHeader title="Nearest Books" seeAllHref={seeAllHref} />
      <div className={grid3}>
        {books.map((book) => (
          <Link key={book.id} href={href(book)} className={cardBase}>
            <div className="relative h-[100px] bg-app-bg md:h-[170px]">
              <BookCover src={book.cover} alt={book.title} />
              <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-0.5 rounded bg-white/95 px-1.5 py-0.5 text-[8px] font-bold text-primary shadow-sm md:text-[10px]">
                <IoLocationSharp size={8} /> {book.distance}
              </span>
            </div>
            <CardInfo book={book} heart />
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Your Active Listings (horizontal, ACTIVE badge, “List Another”) ──

export function MyListingsSection({ books }: { books: BookView[] }) {
  if (!books.length) return null;
  return (
    <section className="mt-5">
      <SectionHeader
        className="px-6"
        title="Your Active Listings"
        seeAllHref="/dashboard/listings"
        linkLabel="MANAGE"
        icon={
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-primary">
            <IoBook size={14} />
          </span>
        }
        badge={
          <span className="font-heading rounded-full bg-primary px-1.5 py-px text-[10px] font-bold text-white">
            {books.length}
          </span>
        }
      />
      <div className="scrollbar-hide flex gap-3 overflow-x-auto px-6 pb-2">
        {books.map((book) => (
          <Link
            key={book.id}
            href={href(book)}
            className={cn(cardBase, 'w-[138px] shrink-0 md:w-[170px]')}
          >
            <div className="relative h-[120px] bg-app-bg md:h-[150px]">
              <BookCover src={book.cover} alt={book.title} />
              <span className="font-heading absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-white">
                <span className="h-1 w-1 rounded-full bg-[#7CFFB2]" /> ACTIVE
              </span>
            </div>
            <div className="p-2">
              <p className="truncate text-[11px] font-bold text-text md:text-sm">{book.title}</p>
              <p className="truncate text-[9px] font-medium text-muted md:text-xs">{book.author}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-heading text-xs font-bold text-primary">
                  {price(book.price)}
                </span>
                <span className="rounded bg-secondary px-1 py-px text-[7.5px] font-bold text-primary">
                  {book.condition}
                </span>
              </div>
            </div>
          </Link>
        ))}
        <Link
          href="/sell"
          className="flex w-[138px] shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-primary/40 bg-white text-center md:w-[170px]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
            <IoAdd size={24} />
          </span>
          <span className="font-heading mt-2 text-xs font-bold text-text">List Another</span>
          <span className="text-[9px] text-muted">Add pre-owned book</span>
        </Link>
      </div>
    </section>
  );
}

// ── Trending Now (sponsored / boosted, gold accents, “AD” tag) ──

export function TrendingSection({ books }: { books: BookView[] }) {
  if (!books.length) return null;
  return (
    <section className="mt-5 bg-gradient-to-b from-[#FFFDF7] via-[#FFFDF7] to-app-bg pb-3 pt-4">
      <SectionHeader
        className="px-6"
        title="Trending Now"
        titleClassName="text-[#6B5020]"
        badge={
          <span className="font-heading rounded bg-[#F4E5CA] px-1.5 py-0.5 text-[8px] font-bold text-[#6B5020]">
            AD
          </span>
        }
      />
      <div className="scrollbar-hide flex gap-3 overflow-x-auto px-6 pb-2">
        {books.map((book) => (
          <Link key={book.id} href={href(book)} className={cn(cardBase, 'w-28 shrink-0 md:w-40')}>
            <div className="relative h-[100px] bg-app-bg md:h-[150px]">
              <BookCover src={book.cover} alt={book.title} />
              <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-white">
                <IoSparkles size={10} />
              </span>
            </div>
            <CardInfo book={book} priceClass="text-[#6B5020]" />
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Recently Added (one featured card + two side rows) ──

export function RecentlyAddedSection({ books }: { books: BookView[] }) {
  if (!books.length) return null;
  const [featured, ...rest] = books;
  return (
    <section className="mt-5 px-6">
      <SectionHeader title="Recently Added" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_2fr]">
        <Link href={href(featured)} className={cardBase}>
          <div className="relative h-[132px] bg-app-bg md:h-[240px]">
            <BookCover src={featured.cover} alt={featured.title} />
            <span className="font-heading absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[7.5px] font-bold tracking-wide text-white">
              NEW LISTING
            </span>
          </div>
          <div className="p-2">
            <p className="truncate text-[11px] font-bold text-text md:text-sm">{featured.title}</p>
            <p className="truncate text-[9px] font-medium text-muted md:text-xs">
              {featured.author}
            </p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="font-heading text-xs font-bold text-primary">
                {price(featured.price)}
              </span>
              <span className="rounded bg-secondary px-1 py-px text-[7.5px] font-bold text-primary">
                {featured.condition}
              </span>
            </div>
          </div>
        </Link>
        <div className="grid content-start gap-3 md:grid-cols-2">
          {rest.slice(0, 4).map((book, i) => (
            <Link
              key={book.id}
              href={href(book)}
              className={cn(
                cardBase,
                'flex h-[98px] items-center gap-2.5 p-1.5 md:h-[114px]',
                i >= 2 && 'hidden md:flex'
              )}
            >
              <div className="h-[68px] w-12 shrink-0 overflow-hidden rounded-lg bg-app-bg md:h-[90px] md:w-16">
                <BookCover src={book.cover} alt={book.title} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold text-text md:text-sm">{book.title}</p>
                <p className="truncate text-[9px] font-medium text-muted md:text-xs">
                  {book.author}
                </p>
                <p className="font-heading mt-1 text-xs font-bold text-primary">
                  {price(book.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Excellent Condition (3-column grid with MINT badge) ──

export function ExcellentConditionSection({ books }: { books: BookView[] }) {
  if (!books.length) return null;
  return (
    <section className="mt-5 px-6">
      <SectionHeader title="Excellent Condition" />
      <div className={grid3}>
        {books.map((book) => (
          <Link key={book.id} href={href(book)} className={cardBase}>
            <div className="relative h-[100px] bg-app-bg md:h-[170px]">
              <BookCover src={book.cover} alt={book.title} />
              <span className="font-heading absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded bg-app-green px-1.5 py-0.5 text-[8px] font-bold text-white">
                <IoSparkles size={8} /> MINT
              </span>
            </div>
            <CardInfo book={book} />
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── People Are Viewing (highlighted trending row + grid) ──

export function PeopleViewingSection({ books }: { books: BookView[] }) {
  if (!books.length) return null;
  const [top, ...rest] = books;
  return (
    <section className="mt-5 px-6">
      <SectionHeader title="People Are Viewing" />
      <Link
        href={href(top)}
        className="mb-3 flex items-center gap-3 rounded-xl border border-[rgba(0,128,128,0.15)] bg-secondary p-2"
      >
        <div className="h-[68px] w-12 shrink-0 overflow-hidden rounded-lg bg-app-bg">
          <BookCover src={top.cover} alt={top.title} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-heading inline-flex items-center gap-0.5 rounded-full bg-[rgba(0,128,128,0.15)] px-1.5 py-0.5 text-[8px] font-bold text-primary">
              <IoFlame size={10} /> TRENDING
            </span>
            <span className="text-[9px] text-muted">{top.views} views</span>
          </div>
          <p className="mt-1 truncate text-xs font-bold text-text md:text-sm">{top.title}</p>
          <p className="truncate text-[10px] text-muted">{top.author}</p>
          <p className="font-heading text-xs font-bold text-primary">{price(top.price)}</p>
        </div>
        <span className="font-heading rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white">
          View
        </span>
      </Link>
      {rest.length > 0 && (
        <div className={grid3}>
          {rest.map((book) => (
            <Link key={book.id} href={href(book)} className={cardBase}>
              <div className="h-[95px] bg-app-bg md:h-[170px]">
                <BookCover src={book.cover} alt={book.title} />
              </div>
              <CardInfo book={book} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Ending Soon (2-column compact cards with countdown) ──

export function EndingSoonSection({ books }: { books: (BookView & { timeLeft: string })[] }) {
  if (!books.length) return null;
  return (
    <section className="mt-5 bg-gradient-to-b from-[#FFFDFD] via-[#FFFDFD] to-app-bg px-6 pb-2 pt-4">
      <SectionHeader
        title="Ending Soon"
        icon={<IoHourglass size={16} className="text-app-red" />}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <Link
            key={book.id}
            href={href(book)}
            className={cn(cardBase, 'flex h-[68px] items-center gap-2 p-1.5')}
          >
            <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-app-bg">
              <BookCover src={book.cover} alt={book.title} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-text">{book.title}</p>
              <span className="mt-0.5 inline-flex items-center gap-0.5 rounded-full bg-app-red-light px-1.5 py-px text-[8px] font-bold text-app-red">
                <IoTime size={9} /> {book.timeLeft}
              </span>
              <p className="font-heading text-xs font-bold text-primary">{price(book.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Category grid card (GenreMasonryLayout) ──

export function MasonryBookCard({ book }: { book: BookView }) {
  return (
    <Link
      href={href(book)}
      className="block overflow-hidden rounded-2xl border border-gray-light bg-white p-2.5 shadow-card transition hover:-translate-y-0.5"
    >
      <div className="h-48 overflow-hidden rounded-[10px] bg-app-bg md:h-60">
        <BookCover src={book.cover} alt={book.title} />
      </div>
      <p className="font-heading mt-2.5 truncate text-sm font-bold text-text">{book.title}</p>
      <p className="mt-0.5 truncate text-xs font-medium text-muted">{book.author}</p>
      <div className="mt-2.5 flex items-center justify-between">
        <span className="font-heading text-[15px] font-bold text-primary">{price(book.price)}</span>
        <HeartButton listingId={book.id} sellerId={book.sellerId} size={15} />
      </div>
    </Link>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-light bg-white p-2.5">
      <div className="h-48 animate-pulse rounded-[10px] bg-[#e6eeee]" />
      <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-[#e6eeee]" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[#e6eeee]" />
    </div>
  );
}
