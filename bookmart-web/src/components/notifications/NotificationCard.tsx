"use client";

import type { Notification } from "@/types/notification";
import NotificationStatusDot from "./NotificationStatusDot";
import PriceDropNotification from "./PriceDropNotification";
import InterestedBuyerNotification from "./InterestedBuyerNotification";
import NewBookNotification from "./NewBookNotification";
import RequestResponseNotification from "./RequestResponseNotification";
import WishlistUpdateNotification from "./WishlistUpdateNotification";
import OrderUpdateNotification from "./OrderUpdateNotification";
import SystemNotification from "./SystemNotification";
import PromotionalNotification from "./PromotionalNotification";

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

export default function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const renderContent = () => {
    switch (notification.type) {
      case "price_drop":
        return <PriceDropNotification data={notification.data as never} />;
      case "interested_buyer":
        return <InterestedBuyerNotification data={notification.data as never} />;
      case "new_book_alert":
        return <NewBookNotification data={notification.data as never} />;
      case "request_response":
        return <RequestResponseNotification data={notification.data as never} />;
      case "wishlist_update":
        return <WishlistUpdateNotification data={notification.data as never} />;
      case "order_update":
        return <OrderUpdateNotification data={notification.data as never} />;
      case "system":
        return <SystemNotification data={notification.data as never} />;
      case "promotional":
        return <PromotionalNotification data={notification.data as never} />;
      default:
        return <p className="text-sm text-slate-500">{(notification.data as { message?: string }).message || "Notification"}</p>;
    }
  };

  return (
    <article
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <NotificationStatusDot read={notification.read} type={notification.type} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">{notification.title}</p>
              {renderContent()}
            </div>
            <time
              dateTime={new Date(notification.timestamp).toISOString()}
              className="shrink-0 text-xs text-slate-400"
            >
              {notification.timestampLabel}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
}
