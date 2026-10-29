'use client';

import { GraduationCap, MapPin, Search, Share2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ListingRow } from '@/components/listing/listing-card';
import { Button, Card, EmptyState, PageHeader, Skeleton } from '@/components/ui/primitives';
import { useColleges, useListings } from '@/hooks/use-api';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

export default function CollegeInsightsPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: colleges = [], isLoading } = useColleges(debounced);
  const latest = useListings({ status: 'AVAILABLE', ordering: '-created_at', page_size: 12 });
  const others = useMemo(
    () => (latest.data?.results ?? []).filter((l) => l.seller.id !== profile?.user_id),
    [latest.data, profile?.user_id]
  );
  const byState = useMemo(() => {
    const map = new Map<string, typeof colleges>();
    for (const c of colleges) map.set(c.state, [...(map.get(c.state) ?? []), c]);
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [colleges]);

  const invite = async () => {
    const url = `${window.location.origin}/register`;
    const text = `Join me on Bookmart to buy and sell second-hand books${profile?.college ? ` at ${profile.college.name}` : ''}!`;
    try {
      if (navigator.share) await navigator.share({ title: 'Bookmart', text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast.success('Invite link copied');
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="College insights"
        description="Bookmart is better when your whole campus is on it."
      />

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <Card className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-light">
            <GraduationCap className="h-7 w-7 text-brand-primary" />
          </span>
          {profile?.college ? (
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Your college
              </p>
              <p className="text-lg font-bold text-slate-900">{profile.college.name}</p>
              <p className="flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5" /> {profile.college.district},{' '}
                {profile.college.state}
              </p>
            </div>
          ) : (
            <div className="flex-1">
              <p className="font-bold text-slate-900">Add your college</p>
              <p className="text-sm text-slate-500">Connect with students from your campus.</p>
            </div>
          )}
          <Link href="/profile/edit">
            <Button variant="outline" size="sm">
              {profile?.college ? 'Change' : 'Add'}
            </Button>
          </Link>
        </Card>

        <Card className="flex items-center gap-4 bg-gradient-to-br from-brand-primary to-brand-dark text-white">
          <Sparkles className="h-8 w-8 shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Invite your classmates</p>
            <p className="text-sm text-white/80">
              More students means more books and better prices.
            </p>
          </div>
          <Button
            className="bg-white text-brand-dark hover:bg-brand-light"
            size="sm"
            onClick={invite}
          >
            <Share2 className="h-4 w-4" /> Invite
          </Button>
        </Card>
      </div>

      <ListingRow
        title="Fresh on Bookmart"
        subtitle="Latest books listed by students"
        listings={others}
        href="/search"
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Colleges on Bookmart</h2>
            <p className="text-sm text-slate-500">{colleges.length} shown</p>
          </div>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colleges"
              aria-label="Search colleges"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-48" />
        ) : colleges.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No colleges found" />
        ) : (
          <div className="space-y-5">
            {byState.map(([state, list]) => (
              <div key={state}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {state}
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((c) => (
                    <li
                      key={c.id}
                      className={`flex items-center gap-3 rounded-xl border bg-white p-3 ${
                        c.id === profile?.college?.id ? 'border-brand-primary' : 'border-slate-100'
                      }`}
                    >
                      <GraduationCap className="h-5 w-5 shrink-0 text-brand-primary" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.district}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
