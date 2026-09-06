import type { BoostData, BoostBook, PlanId } from "@/types/boost";

const PLANS = [
  {
    id: "pro" as PlanId,
    name: "PRO",
    description: "Boost 1 book per day",
    price: 49,
    boostLimit: 1,
  },
  {
    id: "pro-plus" as PlanId,
    name: "PRO PLUS",
    description: "Boost 3 books per day",
    price: 129,
    boostLimit: 3,
    popular: true,
    badge: "POPULAR",
  },
  {
    id: "ultimate" as PlanId,
    name: "ULTIMATE",
    description: "Boost 10 books per day",
    price: 299,
    boostLimit: 10,
  },
];

const BOOKS: BoostBook[] = [
  {
    id: "bl-1",
    title: "Atomic Habits",
    author: "James Clear",
    price: 350,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    boosted: true,
  },
  {
    id: "bl-2",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    price: 280,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    boosted: false,
  },
  {
    id: "bl-3",
    title: "1984",
    author: "George Orwell",
    price: 199,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
    boosted: false,
  },
];

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchBoostData(): Promise<BoostData> {
  return delay({
    plans: PLANS,
    books: BOOKS,
    currentSubscription: {
      plan: "pro-plus",
      planName: "Pro Plus",
      boostLimit: 3,
    },
    usageToday: 1,
    durationDays: 30,
  });
}

export async function boostBooks(bookIds: string[]): Promise<{ boosted: string[] }> {
  return delay({ boosted: bookIds }, 800);
}
