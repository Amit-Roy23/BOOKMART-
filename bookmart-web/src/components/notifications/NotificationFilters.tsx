"use client";

import type { NotificationFilter } from "@/types/notification";
import { useNotificationActions } from "@/stores/notification-store";

const FILTERS: { value: NotificationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "price_drop", label: "Price Drop" },
  { value: "buyers", label: "Buyers" },
  { value: "orders", label: "Orders" },
  { value: "wishlist", label: "Wishlist" },
  { value: "requests", label: "Requests" },
];

export default function NotificationFilters() {
  const { setFilter, unreadCount } = useNotificationActions();

  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Notification filters">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          role="tab"
          aria-selected={f.value === "all"}
          onClick={() => setFilter(f.value)}
          className="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          {f.label}
        </button>
      ))}
      <span className="ml-2 inline-flex items-center justify-center rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-extrabold text-brand-primary">
        {unreadCount}
      </span>
    </div>
  );
}
