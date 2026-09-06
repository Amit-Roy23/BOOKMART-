"use client";

import type { InterestedBuyerData } from "@/types/notification";

interface InterestedBuyerNotificationProps {
  data: InterestedBuyerData;
}

export default function InterestedBuyerNotification({ data }: InterestedBuyerNotificationProps) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">New Interested Buyer</p>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">
            {data.buyerName} is looking for your {data.bookTitle}. {data.message}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
            >
              Respond
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-blue-200 px-4 py-2 text-xs font-bold text-blue-700 transition-colors hover:border-blue-400"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
