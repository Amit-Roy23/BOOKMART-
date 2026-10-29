'use client';

import { Bell, BookPlus, CheckCheck, Heart, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Button,
  Chip,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@/components/ui/primitives';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, timeAgo } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { NotificationType, PlatformNotification } from '@/types/api';

const TYPE_META: Record<NotificationType, { label: string; icon: typeof Bell; className: string }> =
  {
    BUYER_INTEREST: { label: 'Buyer interest', icon: Heart, className: 'bg-rose-50 text-rose-600' },
    PRICE_DROP: {
      label: 'Price drop',
      icon: TrendingDown,
      className: 'bg-emerald-50 text-emerald-600',
    },
    NEW_LISTING: { label: 'New book', icon: BookPlus, className: 'bg-sky-50 text-sky-600' },
  };

function groupLabel(date: string) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return 'Earlier';
}

export default function NotificationsPage() {
  const router = useRouter();
  const toast = useToast();
  const { data: notifications = [], isLoading, isError, error, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | NotificationType>('ALL');

  const unread = notifications.filter((n) => !n.is_read).length;
  const groups = useMemo(() => {
    const list = notifications.filter((n) =>
      filter === 'ALL' ? true : filter === 'UNREAD' ? !n.is_read : n.notification_type === filter
    );
    const map = new Map<string, PlatformNotification[]>();
    for (const n of list) {
      const key = groupLabel(n.created_at);
      map.set(key, [...(map.get(key) ?? []), n]);
    }
    return [...map.entries()];
  }, [notifications, filter]);

  const open = (n: PlatformNotification) => {
    if (!n.is_read) markRead.mutate(n.id);
    if (n.related_listing) router.push(`/listings/${n.related_listing.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread` : 'You’re all caught up'}
        action={
          unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              loading={markAll.isPending}
              onClick={() =>
                markAll.mutate(undefined, {
                  onSuccess: () => toast.success('All notifications marked as read'),
                  onError: (err) => toast.error(getErrorMessage(err)),
                })
              }
            >
              <CheckCheck className="h-4 w-4" /> Mark all as read
            </Button>
          )
        }
      />

      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        <Chip active={filter === 'ALL'} onClick={() => setFilter('ALL')}>
          All
        </Chip>
        <Chip active={filter === 'UNREAD'} onClick={() => setFilter('UNREAD')}>
          Unread
        </Chip>
        {(Object.keys(TYPE_META) as NotificationType[]).map((type) => (
          <Chip key={type} active={filter === type} onClick={() => setFilter(type)}>
            {TYPE_META[type].label}
          </Chip>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="We’ll let you know when buyers are interested in your books."
        />
      ) : (
        groups.map(([label, items]) => (
          <section key={label} className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</h2>
            <ul className="space-y-2">
              {items.map((n) => {
                const meta = TYPE_META[n.notification_type] ?? TYPE_META.NEW_LISTING;
                const Icon = meta.icon;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => open(n)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition hover:border-brand-border',
                        n.is_read
                          ? 'border-slate-100 bg-white'
                          : 'border-brand-border bg-brand-light/40'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                          meta.className
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-900">{n.title}</span>
                          <span className="shrink-0 text-xs text-slate-400">
                            {timeAgo(n.created_at)}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-sm text-slate-600">{n.body}</span>
                      </span>
                      {!n.is_read && (
                        <span
                          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-primary"
                          aria-label="Unread"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
