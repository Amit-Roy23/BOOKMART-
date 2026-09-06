"use client";

import type { WishlistUpdateData } from "@/types/notification";

interface WishlistUpdateNotificationProps {
  data: WishlistUpdateData;
}

export default function WishlistUpdateNotification({ data }: WishlistUpdateNotificationProps) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4">
      <p className="text-sm text-slate-500 line-clamp-2">
        {data.bookTitle} - {data.message}
      </p>
    </div>
  );
}
