export interface MockListing {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  sellerName: string;
  sellerAvatar: string;
  condition: 'Good Condition' | 'Like New' | 'Acceptable';
  distance?: string; // e.g., "0.5 km"
  college?: string;
  description?: string;
}

export type BookCondition = 'Good Condition' | 'Like New' | 'Acceptable';

export interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
}

export interface WishlistItem {
  id: string;
}

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

export interface MockAuthor {
  name: string;
  booksCount: number;
  image: string;
  bio: string;
  rating: number;
}
