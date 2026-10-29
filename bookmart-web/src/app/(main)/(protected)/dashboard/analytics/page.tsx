'use client';

import { BarChart3, Eye, Heart, MessageCircle, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  BookCover,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Skeleton,
} from '@/components/ui/primitives';
import { useMyListings } from '@/hooks/use-api';
import { cn, formatCompact, formatPrice, listingCover } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

type Metric = 'views_count' | 'favorite_count';

const METRICS: { id: Metric; label: string; color: string }[] = [
  { id: 'views_count', label: 'Views', color: '#008080' },
  { id: 'favorite_count', label: 'Interested', color: '#e11d48' },
];

export default function AnalyticsPage() {
  const { profile } = useAuth();
  const { data: listings = [], isLoading } = useMyListings();
  const [metric, setMetric] = useState<Metric>('views_count');

  const totals = useMemo(
    () => ({
      views: listings.reduce((s, l) => s + l.views_count, 0),
      interested: listings.reduce((s, l) => s + l.favorite_count, 0),
      active: listings.filter((l) => l.status === 'AVAILABLE').length,
      sold: listings.filter((l) => l.status === 'SOLD').length,
    }),
    [listings]
  );

  const ranked = useMemo(
    () => [...listings].sort((a, b) => b[metric] - a[metric]),
    [listings, metric]
  );

  const chartData = ranked.slice(0, 10).map((l) => ({
    name: l.book.title.length > 18 ? `${l.book.title.slice(0, 17)}…` : l.book.title,
    value: l[metric],
  }));
  const activeMetric = METRICS.find((m) => m.id === metric)!;
  const conversion = totals.views ? ((totals.interested / totals.views) * 100).toFixed(1) : '0';

  const cards = [
    { label: 'Listing views', value: totals.views, icon: Eye, hint: 'Across all your books' },
    {
      label: 'Interested buyers',
      value: totals.interested,
      icon: Heart,
      hint: `${conversion}% of views`,
    },
    {
      label: 'WhatsApp contacts',
      value: profile?.whatsapp_contacts ?? 0,
      icon: MessageCircle,
      hint: 'Buyers who reached out',
    },
    {
      label: 'Profile views',
      value: profile?.profile_views ?? 0,
      icon: UserRound,
      hint: 'Tracked daily',
    },
  ];

  if (!isLoading && listings.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No analytics yet"
        description="List your first book to start seeing views and interest from buyers."
        action={
          <Link href="/sell">
            <Button>Sell a book</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Seller analytics" description="See how your listings are performing." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, hint }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <Icon className="h-4 w-4 text-brand-primary" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">
              {isLoading ? <Skeleton className="h-8 w-16" /> : formatCompact(value)}
            </div>
            <p className="text-xs text-slate-400">{hint}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">Performance by book</h2>
            <p className="text-xs text-slate-500">
              {totals.active} active · {totals.sold} sold
            </p>
          </div>
          <div className="flex rounded-xl border border-slate-200 p-0.5">
            {METRICS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetric(m.id)}
                aria-pressed={metric === m.id}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold',
                  metric === m.id ? 'bg-brand-primary text-white' : 'text-slate-600'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={56}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(v) => [v, activeMetric.label]} />
                <Bar
                  dataKey="value"
                  fill={activeMetric.color}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 font-bold text-slate-900">Top performing books</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-2">#</th>
                <th className="py-2">Book</th>
                <th className="py-2 text-right">Views</th>
                <th className="py-2 text-right">Interested</th>
                <th className="py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {ranked.slice(0, 10).map((l, i) => (
                <tr key={l.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2 pr-2 font-bold text-slate-400">{i + 1}</td>
                  <td className="py-2">
                    <Link
                      href={`/listings/${l.id}`}
                      className="flex items-center gap-3 hover:text-brand-primary"
                    >
                      <span className="h-12 w-9 shrink-0 overflow-hidden rounded bg-slate-100">
                        <BookCover src={listingCover(l)} alt="" />
                      </span>
                      <span className="line-clamp-1 font-semibold">{l.book.title}</span>
                    </Link>
                  </td>
                  <td className="py-2 text-right">{l.views_count}</td>
                  <td className="py-2 text-right">{l.favorite_count}</td>
                  <td className="py-2 text-right font-semibold text-brand-dark">
                    {formatPrice(l.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
