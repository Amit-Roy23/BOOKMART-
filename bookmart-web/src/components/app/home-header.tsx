'use client';

/* eslint-disable @next/next/no-img-element -- static SVG logo */
import Link from 'next/link';
import { IoNotificationsOutline, IoSearchOutline } from 'react-icons/io5';
import { Avatar } from '@/components/ui/primitives';
import { useNotifications } from '@/hooks/use-api';
import { useAuth } from '@/providers/auth-provider';

/** Header from the app's Home screen: logo, notification bell with badge, avatar. */
export function HomeHeader() {
  const { profile, status } = useAuth();
  const authed = status === 'authenticated';
  const { data: notifications } = useNotifications(authed);
  const unread = notifications?.filter((n) => !n.is_read).length ?? 0;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[rgba(0,128,128,0.04)] bg-app-bg/95 px-6 pb-4 pt-2 backdrop-blur">
      <Link href="/" aria-label="Bookmart home" className="-ml-2.5">
        <img
          src="/logo.svg"
          alt="Bookmart"
          width={140}
          height={45}
          className="h-[45px] w-[140px]"
        />
      </Link>
      <div className="flex items-center gap-1">
        {authed ? (
          <>
            <Link
              href="/notifications"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-text"
            >
              <IoNotificationsOutline size={22} />
              {unread > 0 && (
                <span className="font-heading absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full border-[1.5px] border-white bg-app-red px-0.5 text-[8px] font-bold leading-none text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
            <Link
              href="/profile/edit"
              aria-label="Edit profile"
              className="ml-1 overflow-hidden rounded-full border-[1.5px] border-secondary"
            >
              <Avatar src={profile?.image} name={profile?.full_name} size={36} />
            </Link>
          </>
        ) : (
          status === 'anonymous' && (
            <Link
              href="/login"
              className="font-heading rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
            >
              Sign In
            </Link>
          )
        )}
      </div>
    </header>
  );
}

/** Tappable search bar that opens the search screen, as on the app home. */
export function SearchBarLink({ placeholder = 'Search Books...' }: { placeholder?: string }) {
  return (
    <div className="mb-4 px-6">
      <Link
        href="/search"
        className="flex h-12 items-center gap-2.5 rounded-3xl bg-white px-4 text-sm font-medium text-muted shadow-search"
      >
        <IoSearchOutline size={20} />
        {placeholder}
      </Link>
    </div>
  );
}
