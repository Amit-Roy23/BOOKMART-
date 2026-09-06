"use client";

import type { NotificationType } from "@/types/notification";

interface NotificationStatusDotProps {
  read: boolean;
  type: NotificationType;
}

const TYPE_COLORS: Record<NotificationType, string> = {
  price_drop: "bg-emerald-500",
  interested_buyer: "bg-blue-500",
  new_book_alert: "bg-purple-500",
  request_response: "bg-amber-500",
  wishlist_update: "bg-pink-500",
  order_update: "bg-teal-500",
  system: "bg-slate-800",
  promotional: "bg-rose-500",
};

export default function NotificationStatusDot({ read, type }: NotificationStatusDotProps) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        read ? "bg-slate-300" : TYPE_COLORS[type] || "bg-brand-primary"
      }`}
      aria-label={read ? "Read" : "Unread"}
    />
  );
}
