'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBack, IoChatbubbleOutline, IoNotificationsOffOutline } from 'react-icons/io5';
import { useBack } from '@/components/app/screen-header';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/primitives';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { PlatformNotification } from '@/types/api';

function stamp(value: string) {
  const d = new Date(value);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${d.toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  )}`;
}

/** The app's NotificationsScreen: full-width rows, unread rows tinted with a teal dot. */
export default function NotificationsPage() {
  const router = useRouter();
  const goBack = useBack('/');
  const { data: notifications = [], isLoading, isError, error, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const unread = notifications.some((n) => !n.is_read);

  const open = (n: PlatformNotification) => {
    if (!n.is_read) markRead.mutate(n.id);
    if (n.related_listing) router.push(`/listings/${n.related_listing.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-gray-light bg-white px-4 py-4">
        <button onClick={goBack} aria-label="Go back" className="text-ink">
          <IoArrowBack size={24} />
        </button>
        <h1 className="flex-1 text-xl font-bold text-ink">Notifications</h1>
        {unread && (
          <button
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="font-heading text-sm font-semibold text-primary"
          >
            Mark all as read
          </button>
        )}
      </header>

      {isLoading ? (
        <div className="space-y-px">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-none" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-6">
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="pt-[15vh]">
          <EmptyState
            icon={IoNotificationsOffOutline}
            title="No Notifications"
            description="We'll let you know when buyers are interested in your books."
          />
        </div>
      ) : (
        <ul className="divide-y divide-gray-light">
          {notifications.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => open(n)}
                className={cn(
                  'flex w-full items-start gap-4 px-4 py-4 text-left transition',
                  n.is_read ? 'bg-white' : 'bg-secondary'
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-app-blue-light/40 text-app-blue">
                  <IoChatbubbleOutline size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'font-heading block text-[15px] text-ink',
                      n.is_read ? 'font-medium' : 'font-bold'
                    )}
                  >
                    {n.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{n.body}</span>
                  <span className="mt-1 block text-[11px] text-muted">{stamp(n.created_at)}</span>
                </span>
                {!n.is_read && (
                  <span
                    className="mt-5 h-2 w-2 shrink-0 rounded-full bg-primary"
                    aria-label="Unread"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
