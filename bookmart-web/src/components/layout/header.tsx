'use client';

import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  Heart,
  LayoutList,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Avatar, Button } from '@/components/ui/primitives';
import { useNotifications } from '@/hooks/use-api';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/nearby', label: 'Nearby' },
  { href: '/authors', label: 'Authors' },
  { href: '/requests', label: 'Requests' },
  { href: '/college-insights', label: 'Colleges' },
];

const USER_LINKS = [
  { href: '/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/listings', label: 'Manage Listings', icon: LayoutList },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/favourites', label: 'Favourites', icon: Heart },
  { href: '/contacts', label: 'Contacts', icon: MessageCircle },
];

function SearchForm({ className, onDone }: { className?: string; onDone?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  return (
    <form
      role="search"
      className={cn('relative', className)}
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
        onDone?.();
      }}
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books, authors, ISBN…"
        aria-label="Search books"
        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-light"
      />
    </form>
  );
}

function UserMenu() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 hover:bg-slate-100"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar src={profile?.image} name={profile?.full_name} size={34} />
        <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-xl animate-fade-in"
        >
          <div className="border-b border-slate-100 px-4 pb-3 pt-1">
            <p className="truncate text-sm font-bold text-slate-900">{profile?.full_name}</p>
            <p className="truncate text-xs text-slate-500">{profile?.email}</p>
          </div>
          {USER_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Icon className="h-4 w-4 text-slate-400" /> {label}
            </Link>
          ))}
          <button
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
              router.replace('/login');
            }}
            className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { status } = useAuth();
  const authed = status === 'authenticated';
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: notifications } = useNotifications(authed);
  const unread = notifications?.filter((n) => !n.is_read).length ?? 0;

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:gap-6 md:px-6">
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex items-center gap-2" aria-label="Bookmart home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
            <BookOpen className="h-4 w-4" />
          </span>
          <span className="hidden text-xl font-extrabold tracking-tight text-brand-dark sm:block">
            Bookmart
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-brand-primary',
                isActive(link.href) && 'text-brand-primary'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <SearchForm className="ml-auto hidden max-w-sm flex-1 md:block" />

        <div className="ml-auto flex items-center gap-1.5 md:ml-0 md:gap-2">
          <Link
            href="/search"
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          {authed ? (
            <>
              <Link href="/sell" className="hidden sm:block">
                <Button size="sm">
                  <Plus className="h-4 w-4" /> Sell a Book
                </Button>
              </Link>
              <Link
                href="/favourites"
                className="hidden rounded-full p-2 text-slate-600 hover:bg-slate-100 sm:block"
                aria-label="Favourites"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <Link
                href="/notifications"
                className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
                aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
              <UserMenu />
            </>
          ) : (
            status === 'anonymous' && (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-3 lg:hidden">
          <SearchForm className="mb-3" onDone={() => setMobileOpen(false)} />
          <nav className="grid gap-1">
            {[...NAV_LINKS, ...(authed ? [{ href: '/sell', label: 'Sell a Book' }] : [])].map(
              (link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50',
                    isActive(link.href) && 'bg-brand-light text-brand-dark'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
