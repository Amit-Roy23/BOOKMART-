"use client";

interface NotificationEmptyStateProps {
  onBrowse?: () => void;
}

export default function NotificationEmptyState({ onBrowse }: NotificationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-light text-brand-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        You&apos;re all caught up!
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        We&apos;ll notify you when something important happens. In the meantime, explore our latest books.
      </p>
      {onBrowse && (
        <button
          onClick={onBrowse}
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-primary/90"
        >
          Browse Books
        </button>
      )}
    </div>
  );
}
