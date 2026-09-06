export interface NearbyBook {
  id: string;
  title: string;
  author: string;
  image: string;
  rating: number;
  reviewCount: number;
  condition: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  distance: string;
  discount: number;
  price: number;
  originalPrice: number;
  favourite: boolean;
  badge?: string;
}
