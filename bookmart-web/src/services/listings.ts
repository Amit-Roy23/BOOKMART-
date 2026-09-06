import type { ListingsData, Listing } from "@/types/listings";
import type { EditListing, EditListingFormValues } from "@/types/listing";

const LISTINGS: Listing[] = [
  {
    id: "al-1",
    title: "Atomic Habits",
    author: "James Clear",
    price: 350,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    views: 152,
    interested: 22,
    messages: 8,
    status: "active",
  },
  {
    id: "al-2",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    price: 230,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    views: 98,
    interested: 14,
    messages: 5,
    status: "active",
  },
  {
    id: "al-3",
    title: "1984",
    author: "George Orwell",
    price: 200,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
    views: 187,
    interested: 41,
    messages: 11,
    status: "active",
  },
  {
    id: "al-4",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 280,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    views: 116,
    interested: 9,
    messages: 3,
    status: "active",
  },
];

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchListings(): Promise<ListingsData> {
  const totalListings = LISTINGS.length;
  const totalViews = LISTINGS.reduce((sum, l) => sum + l.views, 0);
  const interested = LISTINGS.reduce((sum, l) => sum + l.interested, 0);
  return delay({
    listings: LISTINGS,
    stats: { totalListings, totalViews, interested },
  });
}

export const LISTING_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "sold", label: "Sold" },
  { id: "draft", label: "Draft" },
] as const;

export type ListingTab = (typeof LISTING_TABS)[number]["id"];

const ATOMIC_HABITS_IMAGE =
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600";

const DUMMY_LISTING: EditListing = {
  id: "al-1",
  images: [
    {
      id: "img-1",
      preview: ATOMIC_HABITS_IMAGE,
      name: "atomic-habits-cover.jpg",
      size: 248_000,
    },
  ],
  title: "Atomic Habits",
  author: "James Clear",
  category: "Self Help",
  isbn: "9781847941831",
  description: "This book is in good condition.\n\nNo pages missing.\n\nMinimal highlighting.",
  condition: "good",
  price: "350",
  originalPrice: "699",
  visibility: "college",
  status: "active",
  college: { id: "srcc", name: "Shri Ram College of Commerce" },
  performance: {
    views: 152,
    interested: 22,
    whatsappClicks: 8,
    listedOn: "12 May 2024",
    boostRank: 14,
    boostCategory: "Self Help",
  },
};

export async function fetchListingById(id: string): Promise<EditListing | null> {
  await delay(null, 700);
  if (id !== DUMMY_LISTING.id) return null;
  return structuredClone(DUMMY_LISTING);
}

export async function updateListing(
  id: string,
  _data: EditListingFormValues
): Promise<{ id: string }> {
  await delay(null, 1200);
  return { id };
}

export async function deleteListing(id: string): Promise<{ id: string }> {
  await delay(null, 1000);
  return { id };
}
