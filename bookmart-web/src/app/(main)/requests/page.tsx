'use client';

import { CheckCircle2, ClipboardList, Plus, Search, Tag, Trash2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Chip,
  ConditionBadge,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@/components/ui/primitives';
import {
  useDeleteRequirement,
  useMyRequirements,
  useRequirements,
  useUpdateRequirement,
} from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, formatPrice, timeAgo } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { Requirement } from '@/types/api';

function budget(r: Requirement) {
  if (r.min_price && r.max_price)
    return `${formatPrice(r.min_price)} – ${formatPrice(r.max_price)}`;
  if (r.max_price) return `Up to ${formatPrice(r.max_price)}`;
  if (r.min_price) return `From ${formatPrice(r.min_price)}`;
  return 'Any budget';
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  FULFILLED: 'bg-sky-50 text-sky-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

function RequirementCard({ r, mine }: { r: Requirement; mine?: boolean }) {
  const toast = useToast();
  const update = useUpdateRequirement();
  const remove = useDeleteRequirement();
  const { profile } = useAuth();
  const isOwn = mine || r.user.id === profile?.user_id;

  const setStatus = (status: string, message: string) =>
    update.mutate(
      { id: r.id, status },
      {
        onSuccess: () => toast.success(message),
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-slate-900">{r.book?.title ?? r.book_title}</p>
          {r.book?.author && <p className="text-xs text-slate-500">by {r.book.author}</p>}
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold',
            STATUS_STYLES[r.status]
          )}
        >
          {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <ConditionBadge condition={r.preferred_condition} />
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
          <Tag className="h-3 w-3" /> {budget(r)}
        </span>
        {r.matching_count > 0 && (
          <span className="rounded-full bg-brand-light px-2 py-0.5 font-semibold text-brand-dark">
            {r.matching_count} matching listing{r.matching_count > 1 ? 's' : ''}
          </span>
        )}
      </div>
      {r.notes && <p className="text-sm text-slate-600">{r.notes}</p>}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-50 pt-3">
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <Avatar src={r.user.profile_image} name={r.user.full_name} size={24} />
          {isOwn ? 'You' : r.user.full_name} · {timeAgo(r.created_at)}
        </span>
        {isOwn ? (
          <div className="flex gap-1">
            {r.status === 'ACTIVE' && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setStatus('FULFILLED', 'Marked as fulfilled')}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Fulfilled
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setStatus('CANCELLED', 'Request cancelled')}
                >
                  <XCircle className="h-3.5 w-3.5" /> Cancel
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-rose-600 hover:bg-rose-50"
              aria-label="Delete request"
              onClick={() => {
                if (!confirm('Delete this request?')) return;
                remove.mutate(r.id, {
                  onSuccess: () => toast.success('Request deleted'),
                  onError: (err) => toast.error(getErrorMessage(err)),
                });
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          r.status === 'ACTIVE' && (
            <Link href="/sell">
              <Button size="sm" variant="secondary">
                I have this book
              </Button>
            </Link>
          )
        )}
      </div>
    </li>
  );
}

function RequestsView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useAuth();
  const authed = status === 'authenticated';
  const tab = params.get('tab') === 'mine' && authed ? 'mine' : 'all';
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(input.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [input]);

  const all = useRequirements({ search: search || undefined, page });
  const mine = useMyRequirements(authed && tab === 'mine');
  const totalPages = Math.max(1, Math.ceil((all.data?.count ?? 0) / 20));
  const query = tab === 'mine' ? mine : all;
  const items = tab === 'mine' ? (mine.data ?? []) : (all.data?.results ?? []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book requests"
        description="Students looking for specific books. Have one? Sell it to them."
        action={
          <Link href="/requests/new">
            <Button>
              <Plus className="h-4 w-4" /> Request a book
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {authed && (
          <div className="flex gap-2">
            <Chip active={tab === 'all'} onClick={() => router.push(pathname)}>
              All requests
            </Chip>
            <Chip active={tab === 'mine'} onClick={() => router.push(`${pathname}?tab=mine`)}>
              My requests
            </Chip>
          </div>
        )}
        {tab === 'all' && (
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search requested books"
              aria-label="Search requests"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
        )}
      </div>

      {query.isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : query.isError ? (
        <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={tab === 'mine' ? 'You haven’t requested any books' : 'No open requests'}
          description="Can’t find a book? Post a request and sellers will reach out."
          action={
            <Link href="/requests/new">
              <Button>Request a book</Button>
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {items.map((r) => (
            <RequirementCard key={r.id} r={r} mine={tab === 'mine'} />
          ))}
        </ul>
      )}

      {tab === 'all' && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense>
      <RequestsView />
    </Suspense>
  );
}
