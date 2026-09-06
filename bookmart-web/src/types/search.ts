export interface SearchBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  condition: string;
  language: string;
  format: string;
  available: boolean;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  distance: string;
  favourite: boolean;
  category: string;
  subject: string;
}

export interface SearchFilters {
  availability: string[];
  condition: string[];
  priceRange: [number, number];
  language: string[];
  format: string[];
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  sortBy: string;
  page: number;
  pageSize: number;
}
