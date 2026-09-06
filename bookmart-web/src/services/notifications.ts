import type { Notification, PriceDropData, InterestedBuyerData, NewBookAlertData, RequestResponseData, WishlistUpdateData, OrderUpdateData, SystemNotificationData, PromotionalNotificationData } from "@/types/notification";

function priceDrop(overrides: Partial<PriceDropData> = {}): PriceDropData {
  return {
    bookId: "1",
    bookTitle: "Introduction to Algorithms",
    originalPrice: 210,
    newPrice: 150,
    discount: 28,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    ...overrides,
  };
}

function interestedBuyer(overrides: Partial<InterestedBuyerData> = {}): InterestedBuyerData {
  return {
    buyerName: "Jatin Mehta",
    buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    bookTitle: "Artificial Intelligence: A Modern Approach",
    message: "He is not spam. Don't worry!",
    ...overrides,
  };
}

function newBookAlert(overrides: Partial<NewBookAlertData> = {}): NewBookAlertData {
  return {
    sellerName: "Chayan",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    bookCount: 3,
    category: "Computer Science",
    bookTitles: ["Deep Learning", "Clean Code", "Design Patterns"],
    ...overrides,
  };
}

function requestResponse(overrides: Partial<RequestResponseData> = {}): RequestResponseData {
  return {
    responderName: "Rahul Verma",
    responderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    requestTitle: "Looking for Data Structures in C",
    message: "I have a copy available in good condition.",
    ...overrides,
  };
}

function wishlistUpdate(overrides: Partial<WishlistUpdateData> = {}): WishlistUpdateData {
  return {
    bookTitle: "The Pragmatic Programmer",
    bookId: "2",
    updateType: "price_drop",
    message: "Price dropped by 15%",
    ...overrides,
  };
}

function orderUpdate(overrides: Partial<OrderUpdateData> = {}): OrderUpdateData {
  return {
    orderId: "ORD-2048",
    status: "shipped",
    message: "Your order has been shipped and will arrive soon.",
    ...overrides,
  };
}

function systemNotification(overrides: Partial<SystemNotificationData> = {}): SystemNotificationData {
  return {
    title: "Account Verified",
    message: "Your seller account has been verified successfully.",
    actionLabel: "View Dashboard",
    actionHref: "/sell",
    ...overrides,
  };
}

function promotionalNotification(overrides: Partial<PromotionalNotificationData> = {}): PromotionalNotificationData {
  return {
    title: "Weekend Book Fair",
    message: "Get up to 60% off on select books this weekend only.",
    image: "https://images.unsplash.com/photo-1524578271613-df094dcd8c11?w=400",
    actionLabel: "Browse Deals",
    actionHref: "/search",
    ...overrides,
  };
}

export const dummyNotifications: Notification[] = [
  {
    id: "n1",
    type: "price_drop",
    title: "Price Drop Alert",
    description: priceDrop().bookTitle,
    timestamp: new Date("2026-07-06T09:41:00+05:30"),
    timestampLabel: "5m ago",
    read: false,
    data: priceDrop(),
    actions: [{ label: "View Book", href: "/books/1" }],
  },
  {
    id: "n2",
    type: "interested_buyer",
    title: "New Interested Buyer",
    description: `${interestedBuyer().buyerName} is looking for your ${interestedBuyer().bookTitle}`,
    timestamp: new Date("2026-07-06T09:16:00+05:30"),
    timestampLabel: "30m ago",
    read: false,
    data: interestedBuyer(),
    actions: [
      { label: "Respond", primary: true },
      { label: "View Profile", href: "/users/Jatin%20Mehta" },
    ],
  },
  {
    id: "n3",
    type: "new_book_alert",
    title: `New books from ${newBookAlert().sellerName}`,
    description: `${newBookAlert().bookCount} new ${newBookAlert().category} books listed`,
    timestamp: new Date("2026-07-06T08:46:00+05:30"),
    timestampLabel: "1h ago",
    read: false,
    data: newBookAlert(),
    actions: [{ label: "View Books", href: "/sellers/Chayan" }],
  },
  {
    id: "n4",
    type: "request_response",
    title: "New Response to Your Request",
    description: `${requestResponse().responderName} responded to "${requestResponse().requestTitle}"`,
    timestamp: new Date("2026-07-06T07:46:00+05:30"),
    timestampLabel: "2h ago",
    read: true,
    data: requestResponse(),
    actions: [{ label: "View Response", href: "/requests" }],
  },
  {
    id: "n5",
    type: "wishlist_update",
    title: "Wishlist Update",
    description: wishlistUpdate().message,
    timestamp: new Date("2026-07-06T06:46:00+05:30"),
    timestampLabel: "3h ago",
    read: true,
    data: wishlistUpdate(),
    actions: [{ label: "View Book", href: "/books/2" }],
  },
  {
    id: "n6",
    type: "price_drop",
    title: "Price Drop Alert",
    description: "Clean Code is now cheaper",
    timestamp: new Date("2026-07-05T09:46:00+05:30"),
    timestampLabel: "1d ago",
    read: true,
    data: priceDrop({
      bookId: "3",
      bookTitle: "Clean Code",
      originalPrice: 600,
      newPrice: 450,
      discount: 25,
    }),
    actions: [{ label: "View Book", href: "/books/3" }],
  },
  {
    id: "n7",
    type: "interested_buyer",
    title: "New Interested Buyer",
    description: "Aarav is looking for your Design Patterns book",
    timestamp: new Date("2026-07-05T07:46:00+05:30"),
    timestampLabel: "1d ago",
    read: false,
    data: interestedBuyer({
      buyerName: "Aarav",
      buyerAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad2b?w=100",
      bookTitle: "Design Patterns",
      message: "Is the spine intact?",
    }),
    actions: [{ label: "Respond", primary: true }, { label: "View Profile", href: "/users/Aarav" }],
  },
  {
    id: "n8",
    type: "order_update",
    title: "Order Update",
    description: "Your order ORD-1024 has been delivered.",
    timestamp: new Date("2026-07-05T04:46:00+05:30"),
    timestampLabel: "1d ago",
    read: true,
    data: orderUpdate({
      orderId: "ORD-1024",
      status: "delivered",
      message: "Your order has been delivered successfully.",
    }),
    actions: [{ label: "View Order", href: "/orders/ORD-1024" }],
  },
  {
    id: "n9",
    type: "new_book_alert",
    title: "New book from Priya",
    description: "5 new Fiction books listed by Priya",
    timestamp: new Date("2026-07-04T09:46:00+05:30"),
    timestampLabel: "2d ago",
    read: true,
    data: newBookAlert({
      sellerName: "Priya",
      sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      bookCount: 5,
      category: "Fiction",
      bookTitles: ["The Alchemist", "1984", "Pride and Prejudice", "The Great Gatsby", "To Kill a Mockingbird"],
    }),
    actions: [{ label: "View Books", href: "/sellers/Priya" }],
  },
  {
    id: "n10",
    type: "promotional",
    title: "Promotional Notification",
    description: "Check out our latest deals and offers!",
    timestamp: new Date("2026-07-03T09:46:00+05:30"),
    timestampLabel: "3d ago",
    read: true,
    data: promotionalNotification(),
    actions: [{ label: "Browse Deals", href: "/search", primary: true }],
  },
  {
    id: "n11",
    type: "system",
    title: "System Notification",
    description: "Welcome to Bookmart! Explore thousands of books.",
    timestamp: new Date("2026-07-02T09:46:00+05:30"),
    timestampLabel: "4d ago",
    read: true,
    data: systemNotification(),
    actions: [{ label: "Get Started", href: "/", primary: true }],
  },
  {
    id: "n12",
    type: "price_drop",
    title: "Price Drop Alert",
    description: "Atomic Habits is now at its lowest price",
    timestamp: new Date("2026-07-01T09:46:00+05:30"),
    timestampLabel: "5d ago",
    read: true,
    data: priceDrop({
      bookId: "4",
      bookTitle: "Atomic Habits",
      originalPrice: 450,
      newPrice: 320,
      discount: 29,
    }),
    actions: [{ label: "View Book", href: "/books/4" }],
  },
];

export function groupNotificationsByDate(notifications: Notification[]): { label: string; notifications: Notification[] }[] {
  const todayStart = new Date("2026-07-06T00:00:00+05:30");
  const yesterdayStart = new Date("2026-07-05T00:00:00+05:30");
  const lastWeekStart = new Date("2026-06-30T00:00:00+05:30");

  const groups: Record<string, Notification[]> = {};

  for (const notification of notifications) {
    const date = new Date(notification.timestamp);
    let groupLabel: string;

    if (date >= todayStart) {
      groupLabel = "Today";
    } else if (date >= yesterdayStart) {
      groupLabel = "Yesterday";
    } else if (date >= lastWeekStart) {
      groupLabel = "Last Week";
    } else {
      groupLabel = "Earlier";
    }

    if (!groups[groupLabel]) {
      groups[groupLabel] = [];
    }
    groups[groupLabel].push(notification);
  }

  const order = ["Today", "Yesterday", "Last Week", "Earlier"];
  return order
    .filter((label) => groups[label])
    .map((label) => ({
      label,
      notifications: groups[label].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    }));
}
