import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Condition, Listing } from '@/types/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop';

export const CONDITION_LABELS: Record<string, string> = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
  ACCEPTABLE: 'Acceptable',
};

export const CONDITION_STYLES: Record<string, string> = {
  NEW: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  LIKE_NEW: 'bg-teal-50 text-teal-700 ring-teal-200',
  GOOD: 'bg-sky-50 text-sky-700 ring-sky-200',
  FAIR: 'bg-amber-50 text-amber-700 ring-amber-200',
  POOR: 'bg-rose-50 text-rose-700 ring-rose-200',
  ACCEPTABLE: 'bg-amber-50 text-amber-700 ring-amber-200',
};

export const LISTING_CONDITIONS: Condition[] = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'];

export function conditionLabel(condition?: string | null) {
  if (!condition) return '';
  return CONDITION_LABELS[condition] ?? condition;
}

export function listingCover(listing: Listing) {
  const front = listing.listing_images.find((img) => img.label === 'FRONT_COVER');
  return (
    front?.image_url ||
    listing.listing_images[0]?.image_url ||
    listing.book.cover_url ||
    FALLBACK_COVER
  );
}

export function listingAuthors(listing: Listing) {
  return listing.book.authors.map((a) => a.name).join(', ') || 'Unknown Author';
}

export function formatPrice(value: string | number | null | undefined) {
  const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  if (Number.isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function formatDate(value?: string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  });
}

export function timeAgo(value: string) {
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const units: [number, string][] = [
    [60 * 60 * 24 * 365, 'year'],
    [60 * 60 * 24 * 30, 'month'],
    [60 * 60 * 24 * 7, 'week'],
    [60 * 60 * 24, 'day'],
    [60 * 60, 'hour'],
    [60, 'minute'],
  ];
  for (const [size, unit] of units) {
    const count = Math.floor(seconds / size);
    if (count >= 1) return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function formatCompact(num?: number | null) {
  if (!num) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(num);
}

export function initials(name?: string | null) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Build a WhatsApp deep link to contact a seller, as the app does. */
export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
}

/** Only allow same-site relative redirects (e.g. after login). */
export function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
}
