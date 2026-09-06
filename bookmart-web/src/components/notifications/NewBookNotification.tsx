"use client";

import type { NewBookAlertData } from "@/types/notification";

interface NewBookNotificationProps {
  data: NewBookAlertData;
}

export default function NewBookNotification({ data }: NewBookNotificationProps) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
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
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">
            New books from {data.sellerName}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {data.bookCount} new {data.category} books listed
          </p>
        </div>
      </div>
    </div>
  );
}
