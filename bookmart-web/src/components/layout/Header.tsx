'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingCart, Bell, ChevronDown, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useUIStore } from '@/stores/ui-store';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const setIsMobileMenuOpen = useUIStore((s) => s.setIsMobileMenuOpen);
  const cartTotal = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const unreadCount = useNotificationStore((s) => s.unreadCount());

  const toggleMobileMenu = () => {
    const next = !mobileMenuOpen;
    setMobileMenuOpen(next);
    setIsMobileMenuOpen(next);
  };

  const pathname = usePathname();
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/sell', label: 'Sell Book' },
    { href: '/nearby', label: 'Nearby' },
    { href: '/college-insights', label: 'Colleges' },
    { href: '/authors', label: 'Authors' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 md:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-8">
          <Link href="/" className="flex flex-col group" aria-label="Bookmart Home">
            <span className="text-xl md:text-2xl font-bold text-brand-primary tracking-tight group-hover:opacity-80 transition">
              Bookmart
            </span>
            <span className="text-[9px] md:text-[10px] text-slate-400 -mt-1 font-medium tracking-wide">
              Books. Students. Community.
            </span>
          </Link>

          <nav
            className="hidden xl:flex items-center gap-6 text-sm font-semibold text-slate-600"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/categories' && pathname.startsWith('/categories'));
              const linkClassName = [
                'flex items-center gap-1 hover:text-brand-primary transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2 rounded',
                isActive ? 'text-brand-primary font-bold' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <Link key={link.href} href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 max-w-xl mx-2 md:mx-8 relative hidden md:block">
          <label htmlFor="search-input" className="sr-only">
            Search books, authors, ISBN, or topics
          </label>
          <form id="header-search-form" onSubmit={(e) => { e.preventDefault(); const input = e.target.querySelector('#search-input') as HTMLInputElement; const q = input.value.trim(); if (q) { window.location.href = `/search?q=${encodeURIComponent(q)}`; } }} className="flex items-center">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" aria-hidden="true" />
            <input
              id="search-input"
              type="search"
              name="search"
              placeholder="Search books, authors, ISBN, or topics..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-light transition-colors"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-6 text-slate-600">
          <Link
            href="/categories"
            className="flex flex-col items-center relative hover:text-brand-primary transition-colors p-1 focus-visible:outline-2 focus-visible:outline-brand-primary rounded"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart className="w-5 h-5" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-brand-primary text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
            <span className="text-[10px] font-medium mt-0.5 hidden sm:block">Wishlist</span>
          </Link>

          <Link
            href="/dashboard/listings"
            className="flex flex-col items-center relative hover:text-brand-primary transition-colors p-1 focus-visible:outline-2 focus-visible:outline-brand-primary rounded"
            aria-label={`Cart, ${cartTotal} items`}
          >
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            {cartTotal > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-brand-primary text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {cartTotal}
              </span>
            )}
            <span className="text-[10px] font-medium mt-0.5 hidden sm:block">Cart</span>
          </Link>

          <Link
            href="/notifications"
            className={`flex flex-col items-center relative transition-colors p-1 focus-visible:outline-2 focus-visible:outline-brand-primary rounded ${pathname === '/notifications' ? 'text-brand-primary' : 'hover:text-brand-primary'}`}
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-0.5 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
            <span className="text-[10px] font-medium mt-0.5 hidden sm:block">Notifications</span>
          </Link>

          <Link href="/dashboard/listings" className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 relative shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                alt="Arjun profile"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div className="hidden md:flex items-center gap-1 cursor-pointer">
              <span className="text-xs font-bold text-slate-800">Hi, Arjun</span>
              <ChevronDown className="w-3 h-3 text-slate-400" aria-hidden="true" />
            </div>
          </Link>

          <button
            className="xl:hidden p-2 text-slate-600 hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-primary rounded"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          className="xl:hidden mt-4 pb-4 border-t border-slate-100 pt-4"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === '/categories' && pathname.startsWith('/categories'));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors ${isActive ? 'text-brand-primary font-bold' : ''}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

export default Header;
