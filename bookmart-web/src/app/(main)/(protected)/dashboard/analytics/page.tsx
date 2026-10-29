'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoArrowForward,
  IoBarChartOutline,
  IoBookOutline,
  IoChatbubbleOutline,
  IoEyeOutline,
  IoHeartOutline,
} from 'react-icons/io5';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ScreenHeader } from '@/components/app/screen-header';
import { BookCover, Button, EmptyState, Skeleton } from '@/components/ui/primitives';
import { useMyListings } from '@/hooks/use-api';
import { cn, formatCompact, formatPrice, listingAuthors, listingCover } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

// Layout follows the app's Analytics.screen.tsx, plotted from real listing data.

type Metric = 'views' | 'interested' | 'contacts';

export default function AnalyticsPage() {
  const { profile } = useAuth();
  const { data: listings = [], isLoading } = useMyListings();
  const [metric, setMetric] = useState<Metric>('views');

  const active = listings.filter((l) => l.status === 'AVAILABLE');
  const totals = {
    views: listings.reduce((s, l) => s + l.views_count, 0),
    interested: listings.reduce((s, l) => s + l.favorite_count, 0),
    contacts: profile?.whatsapp_contacts ?? 0,
  };

  const cards: { id: Metric; label: string; icon: IconType }[] = [
    { id: 'views', label: 'Total Views', icon: IoEyeOutline },
    { id: 'interested', label: 'Interested', icon: IoHeartOutline },
    { id: 'contacts', label: 'WA Contact', icon: IoChatbubbleOutline },
  ];

  // Contacts aren't tracked per listing, so the chart shows views for that card.
  const chartKey = metric === 'interested' ? 'favorite_count' : 'views_count';
  const ranked = useMemo(
    () => [...listings].sort((a, b) => b.views_count - a.views_count),
    [listings]
  );
  const chartData = ranked.slice(0, 8).map((l) => ({
    name: l.book.title.length > 10 ? `${l.book.title.slice(0, 9)}…` : l.book.title,
    value: l[chartKey],
  }));

  if (!isLoading && listings.length === 0) {
    return (
      <>
        <ScreenHeader title="Analytics" back={false} />
        <EmptyState
          icon={IoBarChartOutline}
          title="No analytics yet"
          description="List your first book to start seeing views and interest from buyers."
          action={
            <Link href="/sell">
              <Button size="md">List a Book</Button>
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Analytics" back={false} />
      <div className="space-y-5 px-6">
        <h2 className="text-xl font-bold text-ink">Your Bookshelf</h2>

        <div className="grid grid-cols-3 gap-3">
          {cards.map(({ id, label, icon: Icon }) => {
            const selected = metric === id;
            return (
              <button
                key={id}
                onClick={() => setMetric(id)}
                aria-pressed={selected}
                className={cn(
                  'rounded-2xl border p-3 text-left transition',
                  selected ? 'border-primary/20 bg-secondary' : 'border-gray-heavy/60 bg-white'
                )}
              >
                <Icon size={18} className={selected ? 'text-primary' : 'text-muted'} />
                <div className="font-heading mt-2 text-2xl font-bold text-ink">
                  {isLoading ? <Skeleton className="h-7 w-10" /> : formatCompact(totals[id])}
                </div>
                <p className="text-[10px] text-muted">{label}</p>
              </button>
            );
          })}
        </div>

        <section className="rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-4">
            <p className="font-heading text-[15px] font-bold text-ink">Performance</p>
            <p className="text-xs text-muted">
              {metric === 'interested' ? 'Interested' : 'Views'} · by book
            </p>
          </div>
          <div className="h-52">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tealFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#008080" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#008080" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical
                    stroke="#e5eaea"
                    horizontal={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: '#8a8a8a' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 9, fill: '#8a8a8a' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#008080"
                    strokeWidth={2.5}
                    fill="url(#tealFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <Link
          href="/dashboard/listings"
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
            <IoBookOutline size={22} />
          </span>
          <span className="flex-1">
            <span className="font-heading block text-[15px] font-bold text-ink">
              Active Listings
            </span>
            <span className="text-xs text-muted">{active.length} books currently live</span>
          </span>
          <span className="font-heading flex items-center gap-1 text-xl font-bold text-primary">
            {active.length} <IoArrowForward size={16} className="-rotate-45" />
          </span>
        </Link>

        <section className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="mb-2 flex items-center gap-2 text-[15px] font-bold text-ink">
            <IoBarChartOutline size={18} className="text-primary" /> Top Performing
          </h3>
          <ul className="divide-y divide-gray-light">
            {ranked.slice(0, 5).map((l, i) => (
              <li key={l.id}>
                <Link href={`/listings/${l.id}`} className="flex items-center gap-3 py-4">
                  <span className="w-5 text-sm font-bold text-muted">{i + 1}</span>
                  <span className="h-12 w-9 shrink-0 overflow-hidden rounded-md bg-app-bg">
                    <BookCover src={listingCover(l)} alt="" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-heading block truncate text-sm font-bold text-ink">
                      {l.book.title}
                    </span>
                    <span className="block truncate text-xs text-muted">{listingAuthors(l)}</span>
                    <span className="mt-1 flex gap-3 text-[11px] text-muted">
                      <span className="inline-flex items-center gap-0.5">
                        <IoEyeOutline size={12} /> {l.views_count}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <IoHeartOutline size={12} /> {l.favorite_count}
                      </span>
                    </span>
                  </span>
                  <span className="font-heading text-sm font-bold text-ink">
                    {formatPrice(l.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
