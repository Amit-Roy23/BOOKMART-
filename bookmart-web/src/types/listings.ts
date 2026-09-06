export type ListingStatus = "active" | "sold" | "draft" | "expired" | "pending";

export interface Listing {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  views: number;
  interested: number;
  messages: number;
  status: ListingStatus;
}

export interface ListingsStats {
  totalListings: number;
  totalViews: number;
  interested: number;
}

export interface ListingsData {
  listings: Listing[];
  stats: ListingsStats;
}
