"use client";

import type { RequestResponseData } from "@/types/notification";

interface RequestResponseNotificationProps {
  data: RequestResponseData;
}

export default function RequestResponseNotification({ data }: RequestResponseNotificationProps) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
      <p className="text-sm text-slate-500 line-clamp-2">
        {data.responderName} responded to &ldquo;{data.requestTitle}&rdquo;. {data.message}
      </p>
    </div>
  );
}
