'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useToggleWishlist } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

/** Heart toggle from the app's book cards (teal filled when saved, with a pop on save). */
export function HeartButton({
  listingId,
  sellerId,
  size = 16,
  className,
}: {
  listingId: number;
  sellerId?: number;
  size?: number;
  className?: string;
}) {
  const { profile, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const toggle = useToggleWishlist();
  const [pop, setPop] = useState(false);
  if (profile && sellerId === profile.user_id) return null;

  const saved = toggle.isSaved(listingId);
  return (
    <button
      type="button"
      aria-label={saved ? 'Remove from favourites' : 'Add to favourites'}
      aria-pressed={saved}
      disabled={toggle.isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (status !== 'authenticated') {
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        if (!saved) {
          setPop(true);
          setTimeout(() => setPop(false), 400);
        }
        toggle.mutate(listingId, { onError: (err) => toast.error(getErrorMessage(err)) });
      }}
      className={cn('flex items-center justify-center', pop && 'animate-heart-pop', className)}
    >
      {saved ? (
        <IoHeart size={size} className="text-primary" />
      ) : (
        <IoHeartOutline size={size} className="text-muted" />
      )}
    </button>
  );
}
