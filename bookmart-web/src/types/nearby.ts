export interface Seller {
  id: string;
  name: string;
  avatar: string;
  college: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp: string;
  distance: string;
  rating: number;
  verified: boolean;
}

export interface NearbyMapBook {
  id: string;
  title: string;
  author: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  condition: string;
  sellerId: string;
  sellerName: string;
  latitude?: number;
  longitude?: number;
  category: string;
  favourite: boolean;
  distance?: string;
}

export interface MapFilters {
  distance: string;
  condition: string[];
  language: string[];
  priceRange: [number, number];
  category: string;
  availability: string;
}
