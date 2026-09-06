"use client";

interface AnalyticsEmptyStateProps {
  onListBook?: () => void;
}

export default function AnalyticsEmptyState({ onListBook }: AnalyticsEmptyStateProps) {
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
          <path d="M3 3v18h18" />
          <path d="M7 16l4-8 4 5 4-9" />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">No analytics yet</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        List your first book to start tracking your performance.
      </p>
      {onListBook && (
        <button
          onClick={onListBook}
          className="mt-8 inline-flex items-center justify-center rounded-[12px] bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          List a Book
        </button>
      )}
    </div>
  );
}
