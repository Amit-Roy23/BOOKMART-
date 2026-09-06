export type NotificationType =
  | "price_drop"
  | "interested_buyer"
  | "new_book_alert"
  | "request_response"
  | "wishlist_update"
  | "order_update"
  | "system"
  | "promotional";

export interface PriceDropData {
  bookId: string;
  bookTitle: string;
  originalPrice: number;
  newPrice: number;
  discount: number;
  image?: string;
}

export interface InterestedBuyerData {
  buyerName: string;
  buyerAvatar?: string;
  bookTitle: string;
  message: string;
}

export interface NewBookAlertData {
  sellerName: string;
  sellerAvatar?: string;
  bookCount: number;
  category: string;
  bookTitles?: string[];
}

export interface RequestResponseData {
  responderName: string;
  responderAvatar?: string;
  requestTitle: string;
  message: string;
}

export interface WishlistUpdateData {
  bookTitle: string;
  bookId: string;
  updateType: "price_drop" | "back_in_stock" | "new_edition";
  message: string;
}

export interface OrderUpdateData {
  orderId: string;
  status: "shipped" | "delivered" | "cancelled" | "processing";
  message: string;
}

export interface SystemNotificationData {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface PromotionalNotificationData {
  title: string;
  message: string;
  image?: string;
  actionLabel?: string;
  actionHref?: string;
}

export type NotificationData =
  | PriceDropData
  | InterestedBuyerData
  | NewBookAlertData
  | RequestResponseData
  | WishlistUpdateData
  | OrderUpdateData
  | SystemNotificationData
  | PromotionalNotificationData;

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  timestampLabel: string;
  read: boolean;
  data: NotificationData;
  actions?: { label: string; href?: string; onClick?: () => void; primary?: boolean }[];
}

export type NotificationFilter = "all" | "unread" | "price_drop" | "buyers" | "orders" | "wishlist" | "requests";

export interface NotificationGroup {
  label: string;
  notifications: Notification[];
}
