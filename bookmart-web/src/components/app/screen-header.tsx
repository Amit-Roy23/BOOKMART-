'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { cn } from '@/lib/utils';

/** Back navigation that falls back to a route when there is no in-app history (e.g. a shared link). */
export function useBack(fallback = '/') {
  const router = useRouter();
  return () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(fallback);
  };
}

/** App bar used on inner screens: back arrow, centered Montserrat title, optional right action. */
export function ScreenHeader({
  title,
  back = true,
  fallback = '/',
  right,
  align = 'center',
  className,
}: {
  title?: string;
  back?: boolean;
  fallback?: string;
  right?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  const goBack = useBack(fallback);
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center gap-3 bg-app-bg/95 px-6 py-5 backdrop-blur',
        className
      )}
    >
      {back ? (
        <button
          onClick={goBack}
          aria-label="Go back"
          className="shrink-0 text-text hover:text-primary"
        >
          <IoArrowBack size={24} />
        </button>
      ) : (
        <span className="w-6 shrink-0" />
      )}
      <h1
        className={cn(
          'min-w-0 flex-1 truncate text-xl font-bold text-text',
          align === 'center' ? 'text-center' : 'text-left'
        )}
      >
        {title}
      </h1>
      <div className="flex min-w-6 shrink-0 justify-end">{right}</div>
    </header>
  );
}
