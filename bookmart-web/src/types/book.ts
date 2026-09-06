export type BookCondition =
  | "Like New"
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor";

export interface Book {
  id: string;

  title: string;

  author: string;

  image: string;

  description?: string;

  category?: string;

  language?: string;

  publisher?: string;

  edition?: string;

  isbn?: string;

  price: number;

  originalPrice: number;

  discount: number;

  rating?: number;

  reviewCount?: number;

  condition: BookCondition;

  seller: {
    id: string;
    name: string;
    verified: boolean;
  };

  distance: string;

  stock: number;

  favourite: boolean;

  available: boolean;
}
