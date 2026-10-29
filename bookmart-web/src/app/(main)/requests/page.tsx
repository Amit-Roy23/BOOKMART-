'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  IoAdd,
  IoCheckmarkCircleOutline,
  IoClipboardOutline,
  IoCloseCircleOutline,
  IoPricetagOutline,
  IoSearchOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import {
  Avatar,
  Button,
  Chip,
  ConditionBadge,
  EmptyState,
  ErrorState,
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
  ACTIVE: 'bg-app-green-light text-app-green',
  FULFILLED: 'bg-app-blue-light text-app-blue',
  CANCELLED: 'bg-gray-light text-muted',
};

function RequirementCard({ r }: { r: Requirement }) {
  const toast = useToast();
  const update = useUpdateRequirement();
  const remove = useDeleteRequirement();
  const { profile } = useAuth();
  const mine = r.user.id === profile?.user_id;

  const setStatus = (status: string, message: string) =>
    update.mutate(
      { id: r.id, status },
      {
        onSuccess: () => toast.success(message),
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );

  return (
    <li className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading truncate text-[15px] font-bold text-ink">
            {r.book?.title ?? r.book_title}
          </p>
          {r.book?.author && <p className="text-xs text-muted">by {r.book.author}</p>}
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold capitalize',
            STATUS_STYLES[r.status]
          )}
        >
          {r.status.toLowerCase()}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ConditionBadge condition={r.preferred_condition} />
        <span className="inline-flex items-center gap-1 rounded-md bg-app-green-light px-1.5 py-0.5 text-[10px] font-bold text-app-green">
          <IoPricetagOutline size={11} /> {budget(r)}
        </span>
        {r.matching_count > 0 && (
          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-primary">
            {r.matching_count} matching
          </span>
        )}
      </div>
      {r.notes && <p className="text-sm text-text">{r.notes}</p>}
      <div className="flex items-center justify-between gap-2 border-t border-gray-light pt-3">
        <span className="flex items-center gap-2 text-xs text-muted">
          <Avatar src={r.user.profile_image} name={r.user.full_name} size={24} />
          {mine ? 'You' : r.user.full_name} · {timeAgo(r.created_at)}
        </span>
        {mine ? (
          <span className="flex gap-1">
            {r.status === 'ACTIVE' && (
              <>
                <button
                  onClick={() => setStatus('FULFILLED', 'Marked as fulfilled')}
                  aria-label="Mark fulfilled"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-app-green hover:bg-app-green-light"
                >
                  <IoCheckmarkCircleOutline size={18} />
                </button>
                <button
                  onClick={() => setStatus('CANCELLED', 'Request cancelled')}
                  aria-label="Cancel request"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-gray-light"
                >
                  <IoCloseCircleOutline size={18} />
                </button>
              </>
            )}
            <button
              onClick={() => {
                if (!confirm('Delete this request?')) return;
                remove.mutate(r.id, {
                  onSuccess: () => toast.success('Request deleted'),
                  onError: (err) => toast.error(getErrorMessage(err)),
                });
              }}
              aria-label="Delete request"
              className="flex h-8 w-8 items-center justify-center rounded-full text-app-red hover:bg-app-red-light"
            >
              <IoTrashOutline size={16} />
            </button>
          </span>
        ) : (
          r.status === 'ACTIVE' && (
            <Link
              href="/sell"
              className="font-heading rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-white"
            >
              I have this book
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
  const query = tab === 'mine' ? mine : all;
  const items = tab === 'mine' ? (mine.data ?? []) : (all.data?.results ?? []);
  const totalPages = Math.max(1, Math.ceil((all.data?.count ?? 0) / 20));

  return (
    <div className="mx-auto max-w-3xl">
      <ScreenHeader
        title="Book Requests"
        right={
          <Link
            href="/requests/new"
            aria-label="Post a requirement"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white"
          >
            <IoAdd size={22} />
          </Link>
        }
      />
      <div className="space-y-4 px-6">
        {authed && (
          <div className="flex gap-2">
            <Chip active={tab === 'all'} onClick={() => router.replace(pathname)}>
              All Requests
            </Chip>
            <Chip active={tab === 'mine'} onClick={() => router.replace(`${pathname}?tab=mine`)}>
              My Requests
            </Chip>
          </div>
        )}
        {tab === 'all' && (
          <div className="flex h-12 items-center gap-2 rounded-3xl bg-white px-4 shadow-card">
            <IoSearchOutline size={18} className="text-muted" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search requested books..."
              aria-label="Search requests"
              className="h-full flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        )}

        {query.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : query.isError ? (
          <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={IoClipboardOutline}
            title={tab === 'mine' ? 'No Requests Yet' : 'No Open Requests'}
            description="Can't find a book? Post a requirement and sellers will reach out."
            action={
              <Link href="/requests/new">
                <Button size="md">Post a Requirement</Button>
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {items.map((r) => (
              <RequirementCard key={r.id} r={r} />
            ))}
          </ul>
        )}

        {tab === 'all' && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pb-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted">
              {page} / {totalPages}
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
