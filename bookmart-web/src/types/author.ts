export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  about?: string;
  bookCount: number;
  category: string;
  verified?: boolean;
  rating?: number;
  totalRatings?: number;
  authorReviews?: number;
  profession?: string;
  location?: string;
  born?: string;
  language?: string;
  followers?: string;
  books?: {
    id: string;
    title: string;
    image: string;
    rating: number;
    reviewCount: number;
    price: number;
    favourite: boolean;
  }[];
}
